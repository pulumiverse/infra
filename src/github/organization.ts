import * as github from "@pulumi/github";

import { OrganizationSettingsConfig } from "../configTypes";

/**
 * Configures the pulumiverse GitHub organization settings.
 *
 * Imports the existing org (ID: 63815353) into Pulumi management. Enables
 * public GitHub Pages creation so the pulumiverse.github.io site can be
 * provisioned via `github.RepositoryPages`. Private Pages require GitHub
 * Enterprise and remain disabled.
 */
export function configureOrganizationSettings(settings: OrganizationSettingsConfig): github.OrganizationSettings {
    return new github.OrganizationSettings("pulumiverse", {
        billingEmail: settings.billingEmail,

        // Org identity
        name: settings.name,
        description: settings.description,
        twitterUsername: settings.twitterUsername,

        // Project features
        hasOrganizationProjects: settings.hasOrganizationProjects,
        hasRepositoryProjects: settings.hasRepositoryProjects,

        // Repository creation: restricted to admins only — members cannot
        // create new repos directly.
        membersCanCreateRepositories: settings.membersCanCreateRepositories,
        membersCanCreatePublicRepositories: settings.membersCanCreatePublicRepositories,
        membersCanCreatePrivateRepositories: settings.membersCanCreatePrivateRepositories,

        // Pages creation: enable public Pages so that org admins (and the
        // deployment token) can publish the pulumiverse.github.io site.
        // Private Pages are not available on the free plan.
        membersCanCreatePages: settings.membersCanCreatePages,
        membersCanCreatePublicPages: settings.membersCanCreatePublicPages,
        membersCanCreatePrivatePages: settings.membersCanCreatePrivatePages,

        membersCanForkPrivateRepositories: settings.membersCanForkPrivateRepositories,
        webCommitSignoffRequired: settings.webCommitSignoffRequired,
    }, {
        // Import the existing organization settings using the org's numeric ID.
        import: "63815353",
        // Ignore fields that are null or Enterprise-only to prevent spurious diffs
        // on every deployment.
        ignoreChanges: [
            "billingEmail",
            "company",
            "blog",
            "email",
            "location",
            "defaultRepositoryPermission",
            "advancedSecurityEnabledForNewRepositories",
            "dependabotAlertsEnabledForNewRepositories",
            "dependabotSecurityUpdatesEnabledForNewRepositories",
            "dependencyGraphEnabledForNewRepositories",
            "secretScanningEnabledForNewRepositories",
            "secretScanningPushProtectionEnabledForNewRepositories",
        ],
    });
}
