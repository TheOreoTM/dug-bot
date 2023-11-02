import { formatSuccessMessage } from '#lib/util/formatter';
import { getLevelInfo } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		for (const member of data) {
			const levelData = getLevelInfo(member.level);

			await this.container.db.userLevel.upsert({
				where: {
					userId: member.id
				},
				create: {
					userId: member.id,
					currentLevel: member.level,
					currentXp: member.xp,
					totalXp: levelData.totalXpOfCurrentLevel,
					requiredXp: levelData.xpNeededToLevelUp
				},
				update: {
					currentLevel: member.level,
					currentXp: member.xp,
					totalXp: levelData.totalXpOfCurrentLevel,
					requiredXp: levelData.xpNeededToLevelUp
				}
			});

			message.channel.send(formatSuccessMessage(`Set level for \`${member.username}\` as \`${member.level}\``));
		}
	}
}

const data = [
	{
		id: '905119507897544705',
		username: 'stringtm',
		discriminator: '0',
		avatar: '80675eea18d3dc72cfe196838bd8b644',
		level: 231,
		xp: 15180,
		messages: 277871
	},
	{
		id: '1022636468822360115',
		username: 'nousernamemoment',
		discriminator: '0',
		avatar: 'f0ab46b692e9acd917ee4b59338e6592',
		level: 212,
		xp: 10243,
		messages: 135238
	},
	{
		id: '1127278014854598758',
		username: '.yourfavouriteperson.',
		discriminator: '0',
		avatar: 'a1d03a661605865ee35be1d864f774e1',
		level: 147,
		xp: 2505,
		messages: 57132
	},
	{
		id: '822000944786047017',
		username: '❒❒',
		discriminator: '7510',
		avatar: 'b17fa49b5b1e4c9c25505c583b8f9fbc',
		level: 146,
		xp: 9819,
		messages: 93318
	},
	{
		id: '647242469922308097',
		username: '_saulgoodman',
		discriminator: '0',
		avatar: '6b9bd38ac617fd0494ecc86cb8854b43',
		level: 143,
		xp: 6466,
		messages: 164784
	},
	{
		id: '947780201973182525',
		username: 'sed_person',
		discriminator: '0',
		avatar: 'a4996a663a36b3b5d72f818ef9a368d3',
		level: 141,
		xp: 5664,
		messages: 89284
	},
	{
		id: '544788501820997633',
		username: 'alexander_real',
		discriminator: '0',
		avatar: 'fb4076f20def590f7f47fa896dea88e9',
		level: 138,
		xp: 12371,
		messages: 105270
	},
	{
		id: '976941883345498172',
		username: 'ayanour',
		discriminator: '0',
		avatar: '95794fe66eb8ddbcd09db318338e6e15',
		level: 136,
		xp: 11196,
		messages: 46851
	},
	{
		id: '395758956091277315',
		username: 'tmstm.',
		discriminator: '0',
		avatar: '26eb7ba4ca1aa347a57fecce05b05643',
		level: 135,
		xp: 3734,
		messages: 156156
	},
	{
		id: '1045059821663158373',
		username: 'asmrbirra',
		discriminator: '0',
		avatar: '51872788eee71bf542d93bd350d55223',
		level: 129,
		xp: 3480,
		messages: 46446
	},
	{
		id: '757246071989600317',
		username: 'windows69probeta',
		discriminator: '0',
		avatar: null,
		level: 126,
		xp: 9969,
		messages: 69315
	},
	{
		id: '908669414596026368',
		username: 'creaturr',
		discriminator: '0',
		avatar: '6fb744435cb85018a084625ebef219be',
		level: 125,
		xp: 11136,
		messages: 91138
	},
	{
		id: '600707283097485322',
		username: 'theoreotm',
		discriminator: '0',
		avatar: '32485650941715c19ed668cc70719f5a',
		level: 123,
		xp: 2948,
		messages: 116577
	},
	{
		id: '1066844597763985408',
		username: 'rain1000.',
		discriminator: '0',
		avatar: '5ee66a093d601ed18ad63aeef67d14d1',
		level: 122,
		xp: 11038,
		messages: 28241
	},
	{
		id: '938335100993691659',
		username: 'navalblitz',
		discriminator: '0',
		avatar: 'c3d4a9e9bbb44457c602151c783bb03d',
		level: 122,
		xp: 10014,
		messages: 54643
	},
	{
		id: '1024019068958810133',
		username: 'teA.',
		discriminator: '3767',
		avatar: '1e4409bc749594a6d4c01baec933ebf3',
		level: 120,
		xp: 6459,
		messages: 28838
	},
	{
		id: '989039500913147914',
		username: 'sinclair_real',
		discriminator: '0',
		avatar: 'a729ada4f3eec128be0472612a655a76',
		level: 119,
		xp: 10494,
		messages: 45771
	},
	{
		id: '742650537186557985',
		username: '_weeby_',
		discriminator: '0',
		avatar: '1e0b2302e93941e78b6efe2a297e90f1',
		level: 119,
		xp: 9154,
		messages: 83134
	},
	{
		id: '909017469337886750',
		username: 'sythc_rap_god',
		discriminator: '0',
		avatar: 'f4b282f0698722fe998d7db078aa20e1',
		level: 119,
		xp: 6212,
		messages: 39417
	},
	{
		id: '1014566477518622790',
		username: '_dodzzz',
		discriminator: '0',
		avatar: '5ea99bb6443ec61289cfab411fcbfbe7',
		level: 116,
		xp: 1574,
		messages: 19960
	},
	{
		id: '1106608450328346644',
		username: 's6v',
		discriminator: '0172',
		avatar: '027b85e2b2819b140401e1d807bf9e1e',
		level: 115,
		xp: 3706,
		messages: 30277
	},
	{
		id: '1014858159556403242',
		username: 'tragicalsinns7',
		discriminator: '0',
		avatar: 'a0258b86347ad28b962bce014c53498a',
		level: 114,
		xp: 6018,
		messages: 25305
	},
	{
		id: '780782122712956959',
		username: 'endermanyt',
		discriminator: '0',
		avatar: '7b0bbca14e70fb23505a6f014106c516',
		level: 114,
		xp: 4999,
		messages: 70635
	},
	{
		id: '1082687524088057916',
		username: 'kss.1',
		discriminator: '0',
		avatar: null,
		level: 113,
		xp: 10567,
		messages: 26585
	},
	{
		id: '1096675730835914854',
		username: 'Lili',
		discriminator: '4444',
		avatar: 'fdcf6b60ae627144a78f4daae7026430',
		level: 112,
		xp: 4098,
		messages: 13639
	},
	{
		id: '991285101684076654',
		username: 'Zethorn',
		discriminator: '4127',
		avatar: '5ce3e70c5c08a4c4e0a8557ab5ea98d1',
		level: 111,
		xp: 2859,
		messages: 21597
	},
	{
		id: '508552375397515285',
		username: 'realsion',
		discriminator: '0',
		avatar: '1556ddd851c04dd11fe6fb74000b8eb2',
		level: 111,
		xp: 2345,
		messages: 23292
	},
	{
		id: '1121376209792675863',
		username: 'rainhoghost',
		discriminator: '0',
		avatar: '9a3470d4e32c616ae7814d402fbcbfd6',
		level: 110,
		xp: 8442,
		messages: 13968
	},
	{
		id: '707858280919335002',
		username: 'au_haro211',
		discriminator: '0',
		avatar: '4d744037a44898e14510a337442ce247',
		level: 109,
		xp: 5726,
		messages: 49642
	},
	{
		id: '906689490247090176',
		username: 'ghosts_wife11',
		discriminator: '0',
		avatar: '8845e027f49229a6e0eecd5608c55430',
		level: 109,
		xp: 3561,
		messages: 56503
	},
	{
		id: '887251378546806795',
		username: 'natureontop',
		discriminator: '0',
		avatar: 'fcf7dafac135d2dca55636491d130f3a',
		level: 108,
		xp: 10335,
		messages: 74651
	},
	{
		id: '983980212637302784',
		username: 'xavierak',
		discriminator: '0',
		avatar: 'db4c98ca7741ccf60f3657ab1d36af32',
		level: 108,
		xp: 426,
		messages: 21413
	},
	{
		id: '846045718078685196',
		username: '𝐀𝐢დ',
		discriminator: '8677',
		avatar: '09f33e89510e26b43b11ffbb51cc27d2',
		level: 106,
		xp: 5654,
		messages: 73517
	},
	{
		id: '904090762063523851',
		username: '.rainydayss_',
		discriminator: '0',
		avatar: 'a699e3d38376d74d5ad3515b48ec6938',
		level: 105,
		xp: 10193,
		messages: 46493
	},
	{
		id: '834594378889560094',
		username: 'bdtf',
		discriminator: '0',
		avatar: '386575d82dcd5943d5d83fca71b9f94c',
		level: 105,
		xp: 3635,
		messages: 32485
	},
	{
		id: '1080860725934829628',
		username: 'baburao3783',
		discriminator: '0',
		avatar: 'c316cdfd4ffe426ebc1b6e38de1df00f',
		level: 105,
		xp: 1172,
		messages: 22867
	},
	{
		id: '1146472024978493471',
		username: 'notlookingforkids',
		discriminator: '8465',
		avatar: '4f07927bd06338e52f95828345a46a82',
		level: 105,
		xp: 1071,
		messages: 9482
	},
	{
		id: '1058649956216483840',
		username: 'dino_killzzzs',
		discriminator: '0',
		avatar: '9d7e74bbabfb65d7777f6cb91e157265',
		level: 104,
		xp: 9389,
		messages: 34026
	},
	{
		id: '887236922064371733',
		username: 'lexi',
		discriminator: '4242',
		avatar: '241f534b9c3c9e13e80938dc9c01a052',
		level: 104,
		xp: 9142,
		messages: 86881
	},
	{
		id: '1024641654642196604',
		username: 'Ravan',
		discriminator: '0064',
		avatar: null,
		level: 104,
		xp: 4752,
		messages: 17665
	},
	{
		id: '1027793328554639410',
		username: 'cordelia_.',
		discriminator: '0',
		avatar: '39374fe607849e77d4c335ca8f33d212',
		level: 104,
		xp: 3496,
		messages: 56535
	},
	{
		id: '1033405716200955955',
		username: '𝙼𝚊𝚏𝚒𝚊',
		discriminator: '3301',
		avatar: '4771dcf35ee9841f3ad80754bdf1f023',
		level: 103,
		xp: 7623,
		messages: 3511
	},
	{
		id: '1146267551370838109',
		username: 'ryoka2033',
		discriminator: '0',
		avatar: '7be40b6c223cf58d9e6ae95ad1993fe1',
		level: 102,
		xp: 31,
		messages: 1010
	},
	{
		id: '1024971178030399528',
		username: 'loo10',
		discriminator: '0',
		avatar: 'd860a1a9f0ee9ff5a46a69e259a07aa2',
		level: 101,
		xp: 7492,
		messages: 2776
	},
	{
		id: '908331942058000414',
		username: 'not_parry',
		discriminator: '0',
		avatar: '6623eea547f56c1223c156092a20c609',
		level: 101,
		xp: 2753,
		messages: 68881
	},
	{
		id: '1022219550911111268',
		username: "slayer'",
		discriminator: '8247',
		avatar: 'a87fdea0612fcad58ef0ddadaf423322',
		level: 100,
		xp: 8373,
		messages: 273
	},
	{
		id: '1091761312645787698',
		username: 'MR SHELBY',
		discriminator: '4008',
		avatar: 'af620e5ce9242831f2b953b67e519ff4',
		level: 100,
		xp: 6222,
		messages: 21033
	},
	{
		id: '1168131628191715338',
		username: 'bruhmomemt.com',
		discriminator: '0',
		avatar: 'a2ecaf0c57d1c6577fae23f4760635e7',
		level: 100,
		xp: 5758,
		messages: 669
	},
	{
		id: '991617473096986684',
		username: 'efé',
		discriminator: '3334',
		avatar: '757c13b48f3d7b9de9050cf1f8396559',
		level: 100,
		xp: 3499,
		messages: 1048
	},
	{
		id: '1067899143734972426',
		username: 'Naif',
		discriminator: '4948',
		avatar: null,
		level: 100,
		xp: 2274,
		messages: 382
	},
	{
		id: '981913808668885022',
		username: 'hentie.tm',
		discriminator: '0',
		avatar: '1165a34de66f09b3491d5d011c6580fb',
		level: 100,
		xp: 598,
		messages: 42588
	},
	{
		id: '1079262784652574720',
		username: 'chowwiechowchow',
		discriminator: '0',
		avatar: '5cfb7d23d266f72cd450426f2c3189b4',
		level: 97,
		xp: 8757,
		messages: 35163
	},
	{
		id: '948424303223914548',
		username: 'wolkig_',
		discriminator: '0',
		avatar: '7cab6be5b66dea76541f89e16dea8846',
		level: 96,
		xp: 8438,
		messages: 29865
	},
	{
		id: '872537209000042579',
		username: 'Dodz',
		discriminator: '5587',
		avatar: '9c6220dfedaba990ce22d9696241d247',
		level: 96,
		xp: 7368,
		messages: 57693
	},
	{
		id: '789452280793530370',
		username: 'Dev.',
		discriminator: '4105',
		avatar: '420c4391f1e7dfa2dc361520e950623a',
		level: 96,
		xp: 7242,
		messages: 153909
	},
	{
		id: '992659641089667102',
		username: 'chainz_y',
		discriminator: '0',
		avatar: '40a9b9434c5a96177064b65ce6ece314',
		level: 96,
		xp: 1803,
		messages: 31463
	},
	{
		id: '1012163987087052970',
		username: 'Zethorn',
		discriminator: '7363',
		avatar: 'a5175fc13f4ac5cdea5ae141c817a9d6',
		level: 93,
		xp: 7780,
		messages: 2466
	},
	{
		id: '870767867510018100',
		username: 'arriri',
		discriminator: '0574',
		avatar: '60a3a78e63a245644891cc30eda0aada',
		level: 93,
		xp: 4123,
		messages: 69537
	},
	{
		id: '1114824999736451104',
		username: 'blelele1',
		discriminator: '0',
		avatar: '7d9a125993e4bbbe6cf8243933e583d0',
		level: 93,
		xp: 3357,
		messages: 155
	},
	{
		id: '974154805754855514',
		username: 'dumplingkun',
		discriminator: '0',
		avatar: 'e543a56aaacfa2efb19d27017e6ddfd1',
		level: 93,
		xp: 624,
		messages: 5405
	},
	{
		id: '1096652206742179900',
		username: 'i_am_jin',
		discriminator: '0',
		avatar: 'f7c59bda370d226f6beaeab18822c48f',
		level: 92,
		xp: 6673,
		messages: 42560
	},
	{
		id: '823396500595146793',
		username: 'YouOkay?',
		discriminator: '4590',
		avatar: 'c3b0ab305769feb9b583d391140148f8',
		level: 92,
		xp: 5691,
		messages: 43648
	},
	{
		id: '774865872685891594',
		username: 'didzens',
		discriminator: '0',
		avatar: '23fbb71ad6a3fbcc553c452e1f74d55f',
		level: 91,
		xp: 9155,
		messages: 47138
	},
	{
		id: '919645160877486090',
		username: 'AK',
		discriminator: '6631',
		avatar: 'a439405381938b78508bb8e65611dee4',
		level: 91,
		xp: 2485,
		messages: 52539
	},
	{
		id: '1158049450850275329',
		username: 'rw3999',
		discriminator: '0',
		avatar: '85c79880b55b00bf6768a4676be87eb6',
		level: 90,
		xp: 1024,
		messages: 11893
	},
	{
		id: '1009083202356396082',
		username: 'brah',
		discriminator: '5927',
		avatar: '813a5ed80edbea6d83205d2f4bfc8a33',
		level: 89,
		xp: 7577,
		messages: 1765
	},
	{
		id: '745664582059687966',
		username: 'ted6666',
		discriminator: '0',
		avatar: 'a_c60445211e3950a43d2268e4e7d99f9f',
		level: 89,
		xp: 6440,
		messages: 31723
	},
	{
		id: '1051849619262410822',
		username: '._saisha_.',
		discriminator: '0',
		avatar: '1f0cd0b08729d2327bc8e351e93a1c53',
		level: 89,
		xp: 1499,
		messages: 35179
	},
	{
		id: '945594929546145833',
		username: 'rexy69_',
		discriminator: '0',
		avatar: 'f4fcdf61546e7d2ae4025c646f96a735',
		level: 88,
		xp: 6434,
		messages: 31218
	},
	{
		id: '1005827609495613540',
		username: '`ei',
		discriminator: '4183',
		avatar: '70aeb59ee3c5fd6f0b9a18e6da6a4ee1',
		level: 88,
		xp: 4713,
		messages: 513
	},
	{
		id: '1039937230262779986',
		username: 'zethorn',
		discriminator: '0',
		avatar: '66833f1a2f23560b9ac14de55cb5ef47',
		level: 88,
		xp: 530,
		messages: 2982
	},
	{
		id: '897735110730842122',
		username: 'RAVAN',
		discriminator: '4345',
		avatar: 'bed1e14954a6a3aa7206367462818173',
		level: 86,
		xp: 5021,
		messages: 38778
	},
	{
		id: '885752707279912992',
		username: 'zian5920',
		discriminator: '0',
		avatar: null,
		level: 86,
		xp: 4821,
		messages: 37212
	},
	{
		id: '964769505505075241',
		username: 'I.Military',
		discriminator: '9867',
		avatar: 'fdd437d188372ecf17bd70e40b8ff6d6',
		level: 86,
		xp: 4441,
		messages: 42202
	},
	{
		id: '808934308273192980',
		username: 'itz-KIMI.',
		discriminator: '3866',
		avatar: 'f818ddb5be4d4bcd8c259c0258347174',
		level: 85,
		xp: 4611,
		messages: 56907
	},
	{
		id: '1026815965989703770',
		username: '1939_guy',
		discriminator: '0',
		avatar: '51c090e4ba204da5187d09916fec4230',
		level: 85,
		xp: 4195,
		messages: 4533
	},
	{
		id: '892778286051127307',
		username: 'real_unfunny',
		discriminator: '0',
		avatar: 'e466466d85813d303ffbec12ee71f5e0',
		level: 84,
		xp: 6033,
		messages: 47224
	},
	{
		id: '694817297017339905',
		username: 'anotherwhanos',
		discriminator: '0',
		avatar: '736621e9b528811b8b54569a2c3cad81',
		level: 84,
		xp: 5582,
		messages: 65323
	},
	{
		id: '919408747120586793',
		username: 'panda_rona',
		discriminator: '0',
		avatar: '9b48e98f89660a45a53968d8c61bd8f5',
		level: 83,
		xp: 4394,
		messages: 57006
	},
	{
		id: '1157135459554689024',
		username: 'sayuzii_',
		discriminator: '0',
		avatar: '3dba91ca9d94158efad0504e82886182',
		level: 83,
		xp: 3043,
		messages: 517
	},
	{
		id: '950878482211168326',
		username: 'asce0217',
		discriminator: '0',
		avatar: 'af6f29c5e0800c8064b091204a1bc6a6',
		level: 83,
		xp: 2970,
		messages: 32256
	},
	{
		id: '1001062031388057600',
		username: '𝐍𝐢𝐜𝐨𝐥𝐞',
		discriminator: '6330',
		avatar: 'b4fc2615c3bbcaf8ad59066b9305f01b',
		level: 83,
		xp: 2483,
		messages: 30877
	},
	{
		id: '995007303822626928',
		username: 'gho_st000',
		discriminator: '0',
		avatar: '63de463f0ffe7226c58ac1c8fe8367ee',
		level: 82,
		xp: 6086,
		messages: 2607
	},
	{
		id: '691811957812232253',
		username: 'dontcareheh',
		discriminator: '0',
		avatar: '9edcc3a9e9d0d3f9ec94c65ede05b2a1',
		level: 82,
		xp: 5110,
		messages: 49169
	},
	{
		id: '1018860589554094110',
		username: '🐈meow',
		discriminator: '1408',
		avatar: '7933f153210fd31b9c6671d88049db75',
		level: 81,
		xp: 7241,
		messages: 30199
	},
	{
		id: '906960782208667768',
		username: 'Slick™',
		discriminator: '4595',
		avatar: 'fe1aed9a323dbe1fe81c82d18cc53701',
		level: 81,
		xp: 4424,
		messages: 34363
	},
	{
		id: '701278547238453308',
		username: 'notrebekahmikaelson',
		discriminator: '0',
		avatar: '8b7d643847161894c640078cc6c91a23',
		level: 81,
		xp: 4294,
		messages: 53208
	},
	{
		id: '991715226447773716',
		username: 'lakshitha_',
		discriminator: '0',
		avatar: '0abda9852300071b9f81608714aef2fd',
		level: 81,
		xp: 3218,
		messages: 35878
	},
	{
		id: '708789705793339445',
		username: 'bagel pfp mf',
		discriminator: '7141',
		avatar: '67f470d3d26190ea5b591812d75630c8',
		level: 81,
		xp: 1581,
		messages: 29504
	},
	{
		id: '1021787732479062016',
		username: '_loen.',
		discriminator: '0',
		avatar: '974210d4bfbdd051b64754889578adff',
		level: 80,
		xp: 6250,
		messages: 7214
	},
	{
		id: '877082943024152588',
		username: '.tysongranger0001',
		discriminator: '0',
		avatar: 'a1d766f8f9238f77978e9f113e027995',
		level: 80,
		xp: 5884,
		messages: 567
	},
	{
		id: '924305166692397058',
		username: 'carnage.xs',
		discriminator: '0',
		avatar: 'b08412b7fb27a4589029235a8824a1b1',
		level: 80,
		xp: 3552,
		messages: 97190
	},
	{
		id: '930056784868179998',
		username: '🎄malai🎄',
		discriminator: '9999',
		avatar: 'a_c1766cbe54d6f7e672aa7ad3149c2c13',
		level: 80,
		xp: 3550,
		messages: 61643
	},
	{
		id: '864209075045793832',
		username: 'napoleonic',
		discriminator: '0',
		avatar: '6045476250b480305e8810cf6e2c191f',
		level: 80,
		xp: 2847,
		messages: 43218
	},
	{
		id: '1058390353775960137',
		username: 'gyan7371',
		discriminator: '0',
		avatar: '78c157859d57bd530cabf58a8b1329d1',
		level: 80,
		xp: 1936,
		messages: 340
	},
	{
		id: '1090286909487587369',
		username: 'newaccountverified',
		discriminator: '0',
		avatar: '5aa70e9e75d409fe6ff41ceff11cf27a',
		level: 80,
		xp: 344,
		messages: 2007
	},
	{
		id: '969831693353623552',
		username: 'chorzo1409',
		discriminator: '0',
		avatar: '479a8c841c4ff7f28f453229e37a0ae3',
		level: 79,
		xp: 6163,
		messages: 33054
	},
	{
		id: '936001734017437787',
		username: 'Avaxilß',
		discriminator: '6723',
		avatar: '55459ac37e899c82655a349f0da0728d',
		level: 79,
		xp: 5335,
		messages: 29779
	},
	{
		id: '952582083677675541',
		username: '⌊Viki♠™⌉',
		discriminator: '5691',
		avatar: '3a6cb69b0cd9a85a78a0ca8480420933',
		level: 79,
		xp: 4133,
		messages: 5124
	},
	{
		id: '786542258921013248',
		username: 'bonnia.',
		discriminator: '0',
		avatar: '252f526532bf8f08fb2a2fc14128efde',
		level: 79,
		xp: 3896,
		messages: 2178
	}
];
