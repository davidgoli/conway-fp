import { updateGrid } from '../src/index'

test('it visits each cell', () => {
  expect(updateGrid(3,3)(r => c => r+','+c)).toEqual([['0,0','0,1','0,2'],['1,0','1,1','1,2'],['2,0','2,1','2,2']])
})
