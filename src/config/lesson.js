let lessons = [
  '15-baked',
  '15-simple',
  '15-native',
]

lessons = Object.fromEntries(lessons.map(key => [ key , false ]))

function setTrue(key) {
  Object.keys(lessons).forEach(k => {
    lessons[k] = k === key
  })
}
function getTrue(){
  return (
    Object.entries(lessons)
      .filter(([ n , state ]) => state === true )
      [0][0]
  )
}

setTrue('15-native')
export const lesson = getTrue()

console.log('Lesson:',lesson)