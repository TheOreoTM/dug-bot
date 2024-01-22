import { DugColors, ChannelIDs } from '#constants';
import { dailyAnswerCacheKey, dailySubmissionsCacheKey, dailyCurrentQuestion } from '#lib/database/keys';
import { DugCommand } from '#lib/structures';
import { TruthOrDare } from '#lib/types/Api';
import { fetchChannel } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { EmbedBuilder, TextChannel } from 'discord.js';

@ApplyOptions<DugCommand.Options>({
	description: 'ADD',
	requiredUserPermissions: ['Administrator']
})
export class UserCommand extends DugCommand {
	public override async messageRun(message: DugCommand.Message) {
		this.container.logger.info('[SendDailyQuestionTask] Started');

		const previousQuestion = await this.getCurrentQuestion();

		if (previousQuestion) {
			const previousAnswersString = await this.container.cache.get(dailyAnswerCacheKey(previousQuestion));
			const previousAnswers = JSON.parse(previousAnswersString ?? '[]');

			const topAnswers: Record<string, number> = {};

			for (const answer of previousAnswers) {
				if (!topAnswers[answer]) {
					topAnswers[answer] = 1;
					continue;
				}

				topAnswers[answer]++;
			}

			const topAnswersSorted = Object.entries(topAnswers).sort(([, a], [, b]) => b - a);

			const topAnswersString = topAnswersSorted.map(([id, count]) => `<@${id}>: ${count}`).join('\n');

			console.log('🚀 ~ SendDailyQuestionTask ~ run ~ topAnswersString:', topAnswersString);
			const previousQuestionEmbed = new EmbedBuilder()
				.setTitle('Previous question results')
				.setColor(DugColors.Default)
				.setDescription('This is the previous question results\n\n')
				.addFields({ name: 'Answers', value: previousAnswers.length === 0 ? 'No answers' : topAnswersString });

			const channel = await fetchChannel<TextChannel>(ChannelIDs.DailyChan);
			if (!channel) return;

			channel.send({ embeds: [previousQuestionEmbed] });
		}

		let question = await this.getQuestion();

		if (!question) {
			let retries = 3;

			while (!question && retries > 0) {
				question = await this.getQuestion();
				retries--;
			}

			if (!question) {
				this.container.logger.error('[SendDailyQuestionTask] Failed to fetch question');
				return;
			}
		}

		const embed = new EmbedBuilder()
			.setTitle('Which member...')
			.setColor('Random')
			.setDescription(
				`${question.question}\n\nUse \`.daily @user\` and mention the user to send your submission. Eg. .daily <@600707283097485322>`
			)
			.setFooter({ text: `Use ".daily @user" to send you submissions` });

		const channel = await fetchChannel<TextChannel>(ChannelIDs.DailyChan);
		if (!channel) return;

		channel.send({ embeds: [embed] });

		// Reset the cache

		await this.container.cache.set(dailyAnswerCacheKey(question.id), '[]');
		await this.container.cache.set(dailySubmissionsCacheKey(question.id), '[]');
		await this.container.cache.set(dailyCurrentQuestion, question.id);

		send(message, 'Sent daily question');
	}

	private async getCurrentQuestion() {
		const redis = this.container.cache;

		const question = await redis.get(dailyCurrentQuestion);

		return question;
	}

	private async getQuestion(): Promise<TruthOrDare | null> {
		const response = await fetch(`https://api.truthordarebot.xyz/api/paranoia?rating=pg13`);

		const data = (await response.json()) as any;

		if (data.error) {
			return null;
		}

		return data as TruthOrDare;
	}
}
