import * as github from "@pulumi/github";

/**
 * Configures the pulumiverse GitHub organization settings.
 *
 * Imports the existing org (ID: 63815353) into Pulumi management. Enables
 * public GitHub Pages creation so the pulumiverse.github.io site can be
 * provisioned via `github.RepositoryPages`. Private Pages require GitHub
 * Enterprise and remain disabled.
 */
export function configureOrganizationSettings(): github.OrganizationSettings {
    return new github.OrganizationSettings("pulumiverse", {
        // The org has no billing email configured; use an empty string to satisfy
        // the required field, and list it in ignoreChanges to prevent drift.
        billingEmail: "",

        // Org identity
        name: "Pulumiverse",
        description: "The universe of all things Pulumi",
        twitterUsername: "pulumiverse",

        // Project features
        hasOrganizationProjects: true,
        hasRepositoryProjects: true,

        // Repository creation: restricted to admins only — members cannot
        // create new repos directly.
        membersCanCreateRepositories: false,
        membersCanCreatePublicRepositories: false,
        membersCanCreatePrivateRepositories: false,

        // Pages creation: enable public Pages so that org admins (and the
        // deployment token) can publish the pulumiverse.github.io site.
        // Private Pages are not available on the free plan.
        membersCanCreatePages: true,
        membersCanCreatePublicPages: true,
        membersCanCreatePrivatePages: false,

        membersCanForkPrivateRepositories: false,
        webCommitSignoffRequired: false,
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
