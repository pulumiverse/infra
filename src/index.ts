import { Member, Repository, Team } from "./configTypes";
import { readAndParseFilesInFolder } from "./configLoader";
import { configureOrganizationMembers } from "./github/members";
import {configureRepositories} from "./github/repositories";
import { configureOrganizationTeams } from "./github/teams";

async function main() {

    const teamList = await readAndParseFilesInFolder<Team>("01-teams", Team);
    const teams = configureOrganizationTeams(teamList);

    const repositoryList = await readAndParseFilesInFolder<Repository>("02-repositories", Repository);
    const repositories = configureRepositories(repositoryList, teams);

    const memberList = await readAndParseFilesInFolder<Member>("03-members", Member);
    const members = configureOrganizationMembers(memberList, teams, repositories);
}

main()