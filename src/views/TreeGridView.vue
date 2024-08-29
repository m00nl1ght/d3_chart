<template>
  <div>
    <TreeGrid :items="items" :columns="columns" />
  </div>
</template>

<script>
import TreeGrid from './tables/TreeGrid.vue'
export default {
  components: {
    TreeGrid
  },

  data() {
    return {
      // props: {
      //   stripe: false,
      //   border: false,
      //   showHeader: true,
      //   showSummary: false,
      //   showRowHover: true,
      //   showIndex: false,
      //   treeType: true,
      //   isFold: true,
      //   expandType: false,
      //   selectionType: false
      // },

      items: [
        {
          name: 'Jack',
          sex: 'male',
          likes: ['football', 'basketball'],
          score: 10,
          children: [
            {
              name: 'Ashley',
              sex: 'female',
              likes: ['football', 'basketball'],
              score: 20,
              children: [
                {
                  name: 'Ashley',
                  sex: 'female',
                  likes: ['football', 'basketball'],
                  score: 20
                },
                {
                  name: 'Taki',
                  sex: 'male',
                  likes: ['football', 'basketball'],
                  score: 10,
                  children: [
                    {
                      name: 'Ashley',
                      sex: 'female',
                      likes: ['football', 'basketball'],
                      score: 20
                    },
                    {
                      name: 'Taki',
                      sex: 'male',
                      likes: ['football', 'basketball'],
                      score: 10,
                      children: [
                        {
                          name: 'Ashley',
                          sex: 'female',
                          likes: ['football', 'basketball'],
                          score: 20
                        },
                        {
                          name: 'Taki',
                          sex: 'male',
                          likes: ['football', 'basketball'],
                          score: 10
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              name: 'Taki',
              sex: 'male',
              likes: ['football', 'basketball'],
              score: 10
            }
          ]
        },
        {
          name: 'Tom',
          sex: 'male',
          likes: ['football', 'basketball'],
          score: 20,
          children: [
            {
              name: 'Ashley',
              sex: 'female',
              likes: ['football', 'basketball'],
              score: 20,
              children: [
                {
                  name: 'Ashley',
                  sex: 'female',
                  likes: ['football', 'basketball'],
                  score: 20
                },
                {
                  name: 'Taki',
                  sex: 'male',
                  likes: ['football', 'basketball'],
                  score: 10
                }
              ]
            },
            {
              name: 'Taki',
              sex: 'male',
              likes: ['football', 'basketball'],
              score: 10,
              children: [
                {
                  name: 'Ashley',
                  sex: 'female',
                  likes: ['football', 'basketball'],
                  score: 20
                },
                {
                  name: 'Taki',
                  sex: 'male',
                  likes: ['football', 'basketball'],
                  score: 10
                }
              ]
            }
          ]
        },
        {
          name: 'Tom',
          sex: 'male',
          likes: ['football', 'basketball'],
          score: 20
        },
        {
          name: 'Tom',
          sex: 'male',
          likes: ['football', 'basketball'],
          score: 20,
          children: [
            {
              name: 'Ashley',
              sex: 'female',
              likes: ['football', 'basketball'],
              score: 20
            },
            {
              name: 'Taki',
              sex: 'male',
              likes: ['football', 'basketball'],
              score: 10
            }
          ]
        }
      ],
      columns: [
        {
          label: 'name',
          prop: 'name',
          width: '400px'
        },
        {
          label: 'sex',
          prop: 'sex',
          minWidth: '50px'
        },
        {
          label: 'score',
          prop: 'score'
        },
        {
          label: 'likes',
          prop: 'likes',
          minWidth: '200px',
          type: 'template',
          template: 'likes'
        }
      ]
    }
  },

  computed: {
    // propList() {
    //   return Object.keys(this.props).map((item) => ({
    //     name: item
    //   }))
    // },

    bodyData() {
      return this.getBodyData(this.items, this.treeType, this.childrenProp, this.isFold)
    }
  },

  methods: {

    // validateType(type, validTypes, funcName, isReturn = true) {
    //   if (validTypes.indexOf(type) < 0) throw new Error(`${funcName}'s type must is ${validTypes.join(' or ')}.`)
    //   if (isReturn) {
    //     const certainType = {}
    //     validTypes.forEach((item) => {
    //       certainType[item] = item === type
    //     })
    //     return certainType
    //   }
    //   return true
    // },

    // handleEvent(type, $event) {
    //   console.log('handleEvent_TreeGridView')

    //   this.validateType(type, ['header', 'body', 'footer'], 'handleEvent')
    //   console.log('handleEvent')

    //   const eventType = $event.type
    //   if (eventType === 'scroll') {
    //     this.$refs['header-wrapper'].scrollLeft = $event.target.scrollLeft
    //     this.$refs['footer-wrapper'].scrollLeft = $event.target.scrollLeft
    //   }
    //   if (eventType === 'mousewheel') {
    //     const deltaX = $event.deltaX
    //     const $body = this.$refs['body-wrapper']
    //     if (deltaX > 0) {
    //       $body.scrollLeft += 10
    //     } else {
    //       $body.scrollLeft -= 10
    //     }
    //   }
    //   return this.$emit(`${type}-${eventType}`, $event)
    // }
  }

  // mounted() {
  //   const test = this.getBodyData(this.data)
  //   console.log(test)
  // }
}
</script>

<style lang="scss" scoped></style>
