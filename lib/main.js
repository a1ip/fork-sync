"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const Github = require('@actions/github');
const { Octokit } = require("@octokit/rest");
const { retry } = require("@octokit/plugin-retry");
const githubToken = core.getInput('github_token', { required: true });
const context = Github.context;
const MyOctokit = Octokit.plugin(retry);
const octokit = new MyOctokit({ auth: githubToken });
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const owner = core.getInput('owner', { required: false }) || context.repo.owner;
        const base = core.getInput('base', { required: false });
        const head = core.getInput('head', { required: false });
        const mergeMethod = core.getInput('merge_method', { required: false });
        const prTitle = core.getInput('pr_title', { required: false });
        const prMessage = core.getInput('pr_message', { required: false });
        const ignoreFail = core.getInput('ignore_fail', { required: false });
        try {
            let pr = yield octokit.pulls.create({ owner: context.repo.owner, repo: context.repo.repo, title: prTitle, head: owner + ':' + head, base: base, body: prMessage, merge_method: mergeMethod, maintainer_can_modify: false });
            console.log(typeof context.repo.owner);
            console.log(typeof context.repo.repo);
            console.log(typeof pr.data.number);
            console.log("foo");
            let res = yield octokit.pulls.merge({ owner: context.repo.owner, repo: context.repo.repo, pull_number: pr.data.number });
            console.log(res);
        }
        catch (error) {
            console.log(error);
            if (!!error.errors && error.errors[0].message.startsWith('No commits between')) {
                console.log('No commits between ' + context.repo.owner + ':' + base + ' and ' + owner + ':' + head);
            }
            else {
                if (!ignoreFail) {
                    core.setFailed(`Failed to create or merge pull request: ${error !== null && error !== void 0 ? error : "[n/a]"}`);
                }
            }
        }
    });
}
run();
