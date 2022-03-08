import * as github from "@pulumi/github";

const repo = new github.Repository("infra",
    {
        name: 'infra',
        hasDownloads: false,
        hasIssues: true,
        hasProjects: false,
        hasWiki: false,
        visibility: 'public',
    },
    {
        import: 'infra'
    }
);
