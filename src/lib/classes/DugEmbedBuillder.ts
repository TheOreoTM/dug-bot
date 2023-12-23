import { ZeroWidthSpace } from '#constants';
import { EmbedBuilder } from 'discord.js';

export class DugEmbedBuilder extends EmbedBuilder {
	public splitFields(contentOrTitle: string | string[], rawContent?: string | string[]) {
		if (typeof contentOrTitle === 'undefined') return this;

		let title: string;
		let content: string | string[];
		if (typeof rawContent === 'undefined') {
			title = ZeroWidthSpace;
			content = contentOrTitle;
		} else {
			title = contentOrTitle as string;
			content = rawContent;
		}

		if (Array.isArray(content)) content = content.join('\n');
		if (title === ZeroWidthSpace && !this.data.description && content.length < 4096) {
			this.setDescription(content);
			return this;
		}

		let x: number;
		let slice: string;
		while (content.length) {
			if (content.length < 1024) {
				this.addFields({ name: title, value: content, inline: false });
				return this;
			}

			slice = content.slice(0, 1024);
			x = slice.lastIndexOf('\n');
			if (x === -1) x = slice.lastIndexOf(' ');
			if (x === -1) x = 1024;

			this.addFields({ name: title, value: content.trim().slice(0, x), inline: false });
			content = content.slice(x + 1);
			title = ZeroWidthSpace;
		}

		return this;
	}
}
