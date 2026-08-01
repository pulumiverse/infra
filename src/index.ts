import { Member, OrganizationSettingsConfig, Repository, Team } from "./configTypes";
import { readAndParseFile, readAndParseFilesInFolder } from "./configLoader";
import { configureOrganizationMembers } from "./github/members";
import { configureOrganizationSettings } from "./github/organization";
import { configureRepositories } from "./github/repositories";
import { configureOrganizationTeams } from "./github/teams";

async function main() {

    const organizationConfig = await readAndParseFile<OrganizationSettingsConfig>(
        "00-organization/config.yaml",
        OrganizationSettingsConfig,
    );

    // Configure org-level settings first (imports existing org, enables Pages).
    const orgSettings = configureOrganizationSettings(organizationConfig);

    const teamList = await readAndParseFilesInFolder<Team>("01-teams", Team);
    const teams = configureOrganizationTeams(teamList);

    const repositoryList = await readAndParseFilesInFolder<Repository>("02-repositories", Repository);
    const repositories = configureRepositories(repositoryList, teams);

    const memberList = await readAndParseFilesInFolder<Member>("03-members", Member);
    const members = configureOrganizationMembers(memberList, teams, repositories);
}

main()
