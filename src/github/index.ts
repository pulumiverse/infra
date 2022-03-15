import * as gh_repositories from './repositories';
import * as gh_owners from './owners';
import * as gh_members from './members';
import * as gh_teams from './teams';

export const repositories = gh_repositories.all
export const owners = gh_owners.all
export const members = gh_members.all
export const teams = gh_teams.all_teams