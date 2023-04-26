/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
const fs = require('fs-extra')
const { readManifest, writeManifest } = require('../src/utils')

describe('readManifest', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  test('should return the parsed manifest file contents when the file exists', () => {
    const manifestPath = 'manifest.json'
    const expectedManifest = { name: 'my-ext', version: '1.0.0' }
    const expectedManifestStr = JSON.stringify(expectedManifest)

    const readFileSyncMock = jest.spyOn(fs, 'readFileSync').mockReturnValue(expectedManifestStr);

    expect(readManifest(manifestPath)).toEqual(expectedManifest)
    expect(readFileSyncMock).toHaveBeenCalledWith(manifestPath, { encoding: 'utf8' })
  })

  test('should return an empty object when the manifest file does not exist (ENOENT)', () => {
    const manifestPath = 'nonexistent-file.json'
    const readFileSyncMock = jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw { code: 'ENOENT' }
    })

    expect(readManifest(manifestPath)).toEqual({})
    expect(readFileSyncMock).toHaveBeenCalledWith(manifestPath, { encoding: 'utf8' })
  })

  test('should throw an error when fs.readFileSync throws an error with code other than ENOENT', () => {
    const manifestPath = 'invalid-manifest.json'
    const readFileSyncMock = jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw { code: 'EACCES' }
    })

    try {
      readManifest(manifestPath)
    } catch (err) {
      expect(err.code).toEqual('EACCES')
    }
    expect(readFileSyncMock).toHaveBeenCalledWith(manifestPath, { encoding: 'utf8' })
  })

  test('should throw an error when the manifest file is not valid JSON', () => {
    const manifestPath = 'invalid-manifest.json'
    const readFileSyncMock = jest.spyOn(fs, 'readFileSync').mockReturnValue('invalid-json')

    expect(() => {
      readManifest(manifestPath)
    }).toThrow()
    expect(readFileSyncMock).toHaveBeenCalledWith(manifestPath, { encoding: 'utf8' })
  })
})

describe('writeManifest', () => {
  test('should write the manifest to file', () => {
    const manifestPath = 'manifest.json'
    const manifest = { name: 'my-ext', version: '1.0.0' }
    const writeJsonSyncMock = jest.spyOn(fs, 'writeJsonSync').mockImplementation()

    writeManifest(manifest, manifestPath)

    expect(writeJsonSyncMock).toHaveBeenCalledWith(manifestPath, manifest, { spaces: 2 })
  })
})
