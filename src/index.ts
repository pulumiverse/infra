import * as github from './github'

export const repositories = github.repositories.map((repo) => {
    return repo.name
})
export const owners = github.owners.map((owner) => {
    return owner.username
})
export const members = github.members.map((member) => {
    return member.username
})
export const teams = github.teams.map((team) => {
    return team.name
})
