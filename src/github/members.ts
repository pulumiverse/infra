import * as github from "@pulumi/github";

const mattstratton = new github.Membership('matt_stratton',
    {
        username: 'mattstratton',
        role: 'member'
    },
    {
        import: 'pulumiverse:mattstratton'
    }
)

const aaronkao = new github.Membership('aaron_kao',
    {
        username: 'aaronkao',
        role: 'member'
    },
    {
        import: 'pulumiverse:aaronkao'
    }
)

const annematilde = new github.Membership('anne_matilde_r_fjeldstad',
    {
        username: 'annematilde',
        role: 'member'
    },
    {
        import: 'pulumiverse:annematilde'
    }
)

export const all = [ mattstratton, aaronkao, annematilde ]