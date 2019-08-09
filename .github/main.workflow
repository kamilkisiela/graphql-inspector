workflow "Build and Test" {
  on = "push"
  resolves = "Test"
}

action "Install" {
  uses = "actions/npm@master"
  runs = "yarn"
  args = "install"
}

action "Build" {
  needs = "Install"
  uses = "actions/npm@master"
  runs = "yarn"
  args = "build"
}

action "Test" {
  needs = "Build"
  uses = "actions/npm@master"
  runs = "yarn"
  args = "test"
}

workflow "Clean" {
  on = "pull_request"
  resolves = [
    "PR merged",
    "Clean after a PR",
  ]
}

action "PR merged" {
  uses = "./actions/merged"
  secrets = ["GITHUB_TOKEN"]
}

action "Clean after a PR" {
  uses = "./actions/cleanup/"
  secrets = ["GITHUB_TOKEN"]
}

workflow "Auto-Merge Dependabot And Renovate" {
  on = "status"
  resolves = ["Auto Merge"]
}

action "Auto Merge" {
  uses = "kamilkisiela/automerge-action@master"
  secrets = ["GITHUB_TOKEN"]
  env = {
    LABELS = "!wip,dependencies"
    AUTOMERGE = "dependencies"
    AUTOREBASE = "rebase"
    MERGE_METHOD = "squash"
  }
  args = "--debug"
}

workflow "Automatic Rebase" {
  on = "issue_comment"
  resolves = "Rebase"
}

action "Rebase" {
  uses = "cirrus-actions/rebase@1.0"
  secrets = ["GITHUB_TOKEN"]
}
