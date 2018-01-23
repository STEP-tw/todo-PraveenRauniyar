const MockFileSystem = require('../app/mockFileSystem.js');
const assert = require('chai').assert;
describe('MockFileSystem', () => {
  describe('readFileSync', () => {
    let mockfs;
    beforeEach(() => {
      mockfs = new MockFileSystem();
      mockfs.addFile('file1', 'hello');
    });
    it('readFileSync returns content when file is present', () => {
      assert.equal(mockfs.readFileSync('file1'), 'hello');
    });
    it('readFileSync throws error when file not present', () => {
      assert.throws(() => {
        mockfs.readFileSync('file');
      }, Error);
    })
  })

  describe('addFile', () => {
    let mockfs;
    beforeEach(() => {
      mockfs = new MockFileSystem();
    });
    it('addFile should add given file', () => {
      mockfs.addFile('file1');
      assert.deepEqual(mockfs.files,{file1:''});
    });
  })
  describe('existsSync', () => {
    let mockfs;
    beforeEach(() => {
      mockfs = new MockFileSystem();
      mockfs.addFile('file1', 'hello');
    });
    it('returns true when it has the file', () => {
      assert.isOk(mockfs.existsSync('file1'));
    });
    it(`returns false when it doesn't have the file`, () => {
      assert.isNotOk(mockfs.existsSync('file'));
    });
  })
  describe('writeFileSync', () => {
    let mockfs;
    beforeEach(() => {
      mockfs = new MockFileSystem();
      mockfs.addFile('file1', 'hiiii');
    });
    it('replaces the content when it has the file', () => {
      mockfs.writeFileSync('file1', "hello");
      assert.equal(mockfs.files.file1, "hello");
    });
    it(`creates new file with content when there is no such file`, () => {
      mockfs.writeFileSync('file', "hello");
      assert.equal(mockfs.files.file, "hello");
    });
  })
  describe('appendFile', () => {
    let mockfs;
    beforeEach(() => {
      mockfs = new MockFileSystem();
      mockfs.addFile('file1', 'hiiii');
    });
    it('appends the content when it has the file', () => {
      mockfs.appendFile('file1', "hello");
      assert.equal(mockfs.files.file1, "hiiiihello");
    });
    it(`creates new file with content when there is no such file`, () => {
      mockfs.appendFile('file', "hello");
      assert.equal(mockfs.files.file, "hello");
    });
  })
})
