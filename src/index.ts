import { DugClient } from '#lib/DugClient';
import '#lib/setup';

const client = new DugClient();
console.log(process.env.DISCORD_TOKEN);

const main = async () => {
	try {
		client.logger.info('Logging in');
		await client.login(process.env.DISCORD_TOKEN);
		client.logger.info('logged in');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();
