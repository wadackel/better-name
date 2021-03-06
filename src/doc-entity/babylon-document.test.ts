import * as assert from "assert";
import { FileRef, SourceReader, SourceWriter } from "../types";
import { createProject } from "../project";
import { BabylonDocumentEntity } from "./babylon-document";
import { TestSourceIO, DummyFile } from "./testing";

describe("BabylonDocumentEntity", () => {

  describe("#parse", () => {
    it("should catch syntax error", async done => {
      const io = new TestSourceIO(`hogehoge::::`);
      const docEntity = new BabylonDocumentEntity({ fileRef: new DummyFile("fromFile") });
      docEntity.reader = docEntity.writer = io;
      try {
        await docEntity.parse();
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  describe("#transformPreceding", () => {
    it("should not replace source in the same dir move", async done => {
      const io = new TestSourceIO(`import HogeHoge from './hogehoge';`);
      const docEntity = new BabylonDocumentEntity({ fileRef: new DummyFile("fromFile") });
      docEntity.reader = docEntity.writer = io;
      await docEntity.parse();
      docEntity.transformPreceding("toFile");
      await docEntity.flush();
      assert.equal(io.source, `import HogeHoge from './hogehoge';`);
      done();
    });

    it("should replace source", async done => {
      const io = new TestSourceIO(`
import HogeHoge from './hogehoge';
export * from './hogehoge';
export { default } from './hogehoge';
      `);
      const docEntity = new BabylonDocumentEntity({ fileRef: new DummyFile("fromDir/file") });
      docEntity.reader = docEntity.writer = io;
      await docEntity.parse();
      docEntity.transformPreceding("toDir/file");
      await docEntity.flush();
      assert.equal(io.source.trim(), `
import HogeHoge from '../fromDir/hogehoge';
export * from '../fromDir/hogehoge';
export { default } from '../fromDir/hogehoge';
      `.trim());
      done();
    });
  });

  describe("#transformFollowing", () => {
    it("should replace source", async done => {
      const io = new TestSourceIO(`
import HogeHoge from './hogehoge';
export * from './hogehoge';
export { default } from './hogehoge';
      `);
      const docEntity = new BabylonDocumentEntity({ fileRef: new DummyFile("test") });
      docEntity.reader = docEntity.writer = io;
      await docEntity.parse();
      docEntity.transformFollowing({ from: "hogehoge.js", to: "fuga.js" });
      await docEntity.flush();
      assert.equal(io.source.trim(), `
import HogeHoge from './fuga';
export * from './fuga';
export { default } from './fuga';
      `.trim());
      done();
    });

    it("adhoc", async done => {
      const io = new TestSourceIO(`
import HogeHoge from './hogehoge';

import * as Bar from './bar';
      `);
      const docEntity = new BabylonDocumentEntity({ fileRef: new DummyFile("test") });
      docEntity.reader = docEntity.writer = io;
      await docEntity.parse();
      docEntity.transformFollowing({ from: "bar.js", to: "foo.js" });
      docEntity.transformFollowing({ from: "hogehoge.js", to: "fuga.js" });
      docEntity.transformFollowing({ from: "foo.js", to: "piyo.js" });
      await docEntity.flush();
      assert.equal(io.source.trim(), `
import HogeHoge from './fuga';

import * as Bar from './piyo';
      `.trim());
      done();
    });

  });
});
