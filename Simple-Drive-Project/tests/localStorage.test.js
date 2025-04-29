const mockFs = require("mock-fs");
const localStorage = require("../utils/localStorage");
const fs = require("fs");

describe("localStorage", () => {
  beforeEach(() => {
    mockFs({ localStorage: {} });
  });
  afterEach(() => mockFs.restore());

  test("save writes a file", async () => {
    const buffer = Buffer.from("data");
    await localStorage.save("file1", buffer);
    const content = fs.readFileSync("localStorage/file1");
    expect(content).toEqual(buffer);
  });

  test("retrieve reads a file", async () => {
    const buffer = Buffer.from("data2");
    fs.writeFileSync("localStorage/file2", buffer);
    const result = await localStorage.retrieve("file2");
    expect(result).toEqual(buffer);
  });
});
