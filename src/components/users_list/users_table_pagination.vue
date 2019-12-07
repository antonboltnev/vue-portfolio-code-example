<template>
    <table class="users_list_pagination">
            <tr class="list_pagination__wrapper">
              <td 
                v-for='page in pages_data'
                :key='page'
                @click="pageClick(page)"
              >
                <span 
                  class="users_list_pagination_item selected">{{page}}
                </span>
              </td>
            </tr>
          </table>
</template>

<script>
export default {
    name: 'users-table-pagination',
    props: {
        pages_data: {
            type: Number,
            default: 0
        }
    },
    methods: {
        pageClick(page) {
            this.$emit('pageClick', page);
        }
    }
}
</script>

<style>

</style>