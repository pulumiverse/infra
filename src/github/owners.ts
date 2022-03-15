import * as github from "@pulumi/github";

const owners = [
    'ringods',
    'cobraz',
    'stack72',
    'usrbinkat',
    'rawkode',
    'tenwit'
];

export const all = owners.map((userid) => {
    return new github.Membership(`owner_${userid}`,
        {
            username: userid,
            role: 'admin'
        }
    )
})