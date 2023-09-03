import '#lib/setup';
import { DugClient } from '#lib/DugClient';

const client = new DugClient();

const main = async () => {
	try {
		client.logger.info('Logging in');
		await client.login();
		client.logger.info('logged in');
	} catch (error) {
		client.logger.fatal(process.env.DISCORD_TOKEN);
		client.destroy();
		process.exit(1);
	}
};

main();
