import { join } from 'path';

export const rootDir = join(__dirname, '..', '..');
export const srcDir = join(rootDir, 'src');

export const BotPrefix = '.';
export const BotOwners = ['600707283097485322'];
export const EventConfig = {
	EventManager: '1034778285185454090'
};

export const enum DugColors {
	Success = 0x46b485,
	Fail = 0xf05050,
	Warn = 0xfee65c,
	Info = 0x297bd1,
	Loading = 0x23272a,
	Default = 0x2b2d31
}

export const DugEmojis = {
	Success: '<:success:1146683498766291024>',
	Fail: '<:fail:1146683470114996274>',
	Reply: '<:reply:1146683155370221639>',
	Off: '<:off:1146683633483141140>',
	On: '<:on:1146683600641736744>'
};
