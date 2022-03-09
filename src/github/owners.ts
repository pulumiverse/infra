import * as github from "@pulumi/github";

const ringods = new github.Membership('ringo_de_smet',
    {
        username: 'ringods',
        role: 'admin'
    },
    {
        import: 'pulumiverse:ringods'
    }
)

const cobraz = new github.Membership('simen_aw_olsen',
    {
        username: 'cobraz',
        role: 'admin'
    },
    {
        import: 'pulumiverse:cobraz'
    }
)

const stack72 = new github.Membership('paul_stack',
    {
        username: 'stack72',
        role: 'admin'
    },
    {
        import: 'pulumiverse:stack72'
    }
)

export const all = [ ringods, cobraz, stack72 ]