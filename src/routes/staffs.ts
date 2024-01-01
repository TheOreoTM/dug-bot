import { AllStaffRoles, MainServerID, StaffRoles } from '#constants';
import { ApplyOptions } from '@sapphire/decorators';
import { methods, Route, type ApiRequest, type ApiResponse, HttpCodes } from '@sapphire/plugin-api';

@ApplyOptions<Route.Options>({
	route: 'staffs/:staff'
})
export class UserRoute extends Route {
	public async [methods.GET](request: ApiRequest, response: ApiResponse) {
		const staffId = request.params.staff;
		console.log('staffId', staffId);

		const scc = await this.container.client.guilds.fetch(MainServerID);
		const member = await scc.members.fetch(staffId);
		if (!member) return response.error(HttpCodes.BadRequest);

		const isStaff = member.roles.cache.hasAny(...AllStaffRoles);
		let permissionLevel = 0;

		if (member.roles.cache.has(StaffRoles.Junior)) permissionLevel = 1;
		if (member.roles.cache.has(StaffRoles.Staff)) permissionLevel = 10;
		if (member.roles.cache.has(StaffRoles.Manager)) permissionLevel = 20;
		if (member.roles.cache.has(StaffRoles.Admin)) permissionLevel = 30;
		if (member.roles.cache.has(StaffRoles.TrustedAdmin)) permissionLevel = 40;
		if (member.roles.cache.has(StaffRoles.CEO)) permissionLevel = 100;

		return response.json({ isStaff: isStaff, permissionLevel });
	}
}
