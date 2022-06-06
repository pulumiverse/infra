import { MemberType, RepositoryType, TeamType } from "./configTypes";
import { readAndParseFilesInFolder } from "./configLoader";
import { configureOrganizationMembers } from "./github/members";
import {configureRepositories} from "./github/repositories";
import { configureOrganizationTeams } from "./github/teams";

async function main() {

    const teamList = await readAndParseFilesInFolder<TeamType>("01-teams", TeamType);
    const teams = configureOrganizationTeams(teamList);

    const repositoryList = await readAndParseFilesInFolder<RepositoryType>("02-repositories", RepositoryType);
    configureRepositories(repositoryList, teams);

    const memberList = await readAndParseFilesInFolder<MemberType>("03-members", MemberType);
    const members = configureOrganizationMembers(memberList, teams);
}

main()