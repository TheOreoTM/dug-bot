import {
	ApplicationCommandRegistry,
	Command,
	CommandOptionsRunTypeEnum,
	PreconditionContainerArray,
	Args as SapphireArgs,
	UserError,
	type MessageCommandContext
} from '@sapphire/framework';
import {
	AutocompleteInteraction,
	ContextMenuCommandInteraction as CTXMenuCommandInteraction,
	ChatInputCommandInteraction as ChatInputInteraction,
	Message,
	MessageContextMenuCommandInteraction as MessageCTXCommandInteraction,
	PermissionFlagsBits,
	PermissionsBitField,
	UserContextMenuCommandInteraction as UserCTXMenuCommandInteraction
} from 'discord.js';
import { PermissionLevels, type GuildMessage } from '#lib/types';
import { seconds } from '#utils/common';
export abstract class DugCommand extends Command {
	/**
	 * Whether the command can be disabled.
	 */
	public readonly guarded?: boolean;
	/**
	 * Whether the command is hidden from everyone.
	 */
	public readonly hidden?: boolean;
	/**
	 * The permission level required to run the command.
	 */
	public readonly permissionLevel?: PermissionLevels;

	public constructor(context: Command.Context, options: DugCommand.Options) {
		const perms = new PermissionsBitField(options.requiredClientPermissions).add(
			PermissionFlagsBits.SendMessages,
			PermissionFlagsBits.EmbedLinks,
			PermissionFlagsBits.ViewChannel
		);
		super(context, {
			generateDashLessAliases: true,
			requiredClientPermissions: perms,
			runIn: [CommandOptionsRunTypeEnum.GuildAny],
			cooldownDelay: seconds(5),
			...options
		});

		this.guarded = options.guarded ?? false;
		this.hidden = options.hidden ?? false;
		this.permissionLevel = options.permissionLevel ?? PermissionLevels.Everyone;
	}

	public async prefix(message: Message) {
		return await this.container.client.fetchPrefix(message);
	}

	protected error(message: string | UserError.Options, context?: unknown): never {
		throw typeof message === 'string' ? new UserError({ identifier: 'Error', message, context }) : new UserError(message);
	}

	protected override parseConstructorPreConditions(options: DugCommand.Options): void {
		super.parseConstructorPreConditions(options);
		this.parseConstructorPreConditionsPermissionLevel(options);
	}

	protected parseConstructorPreConditionsPermissionLevel(options: DugCommand.Options): void {
		if (options.permissionLevel === PermissionLevels.BotOwner) {
			this.preconditions.append('BotOwner');
			return;
		}

		const container = new PreconditionContainerArray(['BotOwner'], this.preconditions);
		switch (options.permissionLevel ?? PermissionLevels.Everyone) {
			case PermissionLevels.Everyone:
				container.append('Everyone');
				break;
			case PermissionLevels.EventManager:
				container.append('EventManager');
				break;
			case PermissionLevels.Administrator:
				container.append('Administrator');
				break;

			default:
				throw new Error(
					`DugCommand[${this.name}]: "permissionLevel" was specified as an invalid permission level (${options.permissionLevel}).`
				);
		}

		this.preconditions.append(container);
	}
}
export namespace DugCommand {
	/**
	 * The DugCommand Options
	 */
	export type Options = Command.Options & {
		/**
		 * Whether the command can be disabled.
		 */
		guarded?: boolean;
		/**
		 * Whether the command is hidden from everyone.
		 */
		hidden?: boolean;
		/**
		 * The permission level required to run the command.
		 */
		permissionLevel?: number;
	};
	export type MessageContext = MessageCommandContext;
	export type ChatInputCommandInteraction = ChatInputInteraction<'cached'>;
	export type ContextMenuCommandInteraction = CTXMenuCommandInteraction<'cached'>;
	export type UserContextMenuCommandInteraction = UserCTXMenuCommandInteraction<'cached'>;
	export type MessageContextMenuCommandInteraction = MessageCTXCommandInteraction<'cached'>;
	export type AutoComplete = AutocompleteInteraction;
	export type Context = Command.Context;

	export type Args = SapphireArgs;
	export type Message = GuildMessage;
	export type Registry = ApplicationCommandRegistry;
}
