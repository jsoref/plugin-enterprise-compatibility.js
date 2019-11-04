const nock = require("nock");

const Octokit = require("@octokit/rest");

describe("side effects", () => {
  it("does leave other endpoints in tact", () => {
    const octokit = Octokit.plugin(require(".."))();
    expect(octokit.issues.get.endpoint).toBeTruthy();
  });
});

describe("octokit.issues.addLabels() & octokit.issues.replaceLabels()", () => {
  it("octokit.issues.addLabels() sends labels in request body", () => {
    const octokitOriginal = Octokit({ baseUrl: "https://original.test" });
    const octokitPatched = Octokit.plugin(require(".."))({
      baseUrl: "https://patched.test"
    });

    nock("https://original.test")
      .post("/repos/octokit/rest.js/issues/1/labels", {
        labels: ["foo", "bar"]
      })
      .reply(200, {});
    nock("https://patched.test")
      .post("/repos/octokit/rest.js/issues/1/labels", ["foo", "bar"])
      .reply(200, {});

    const options = {
      owner: "octokit",
      repo: "rest.js",
      issue_number: 1,
      labels: ["foo", "bar"]
    };

    return Promise.all([
      octokitOriginal.issues.addLabels(options),
      octokitPatched.issues.addLabels(options)
    ]);
  });

  it("octokit.issues.replaceLabels() sends labels in request body", () => {
    const octokitOriginal = Octokit({ baseUrl: "https://original.test" });
    const octokitPatched = Octokit.plugin(require(".."))({
      baseUrl: "https://patched.test"
    });

    nock("https://original.test")
      .put("/repos/octokit/rest.js/issues/1/labels", { labels: ["foo", "bar"] })
      .reply(200, {});
    nock("https://patched.test")
      .put("/repos/octokit/rest.js/issues/1/labels", ["foo", "bar"])
      .reply(200, {});

    const options = {
      owner: "octokit",
      repo: "rest.js",
      issue_number: 1,
      labels: ["foo", "bar"]
    };

    return Promise.all([
      octokitOriginal.issues.replaceLabels(options),
      octokitPatched.issues.replaceLabels(options)
    ]);
  });
});