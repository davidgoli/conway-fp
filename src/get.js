const wrappedIndex = (length, idx) => idx < 0 ? length + idx : (idx >= length ? idx - length : idx)
const wrappedGet = (a, idx) => a[wrappedIndex(a.length, idx)]

export default (a, r, c) => wrappedGet(wrappedGet(a, r), c)
