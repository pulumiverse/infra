import * as github from "@pulumi/github";

const ringods = new github.Membership('ringo_de_smet',
    {
        username: 'ringods',
        role: 'admin'
    }
)

const cobraz = new github.Membership('simen_aw_olsen',
    {
        username: 'cobraz',
        role: 'admin'
    }
)

const stack72 = new github.Membership('paul_stack',
    {
        username: 'stack72',
        role: 'admin'
    }
)

const usrbinkat = new github.Membership('kathryn_morgan',
    {
        username: 'usrbinkat',
        role: 'admin'
    }
)

const rawkode = new github.Membership('david_flanagan',
    {
        username: 'rawkode',
        role: 'admin'
    }
)

const tenwit = new github.Membership('paul_hicks',
    {
        username: 'tenwit',
        role: 'admin'
    }
)

export const all = [ ringods, cobraz, stack72, usrbinkat, rawkode, tenwit ]