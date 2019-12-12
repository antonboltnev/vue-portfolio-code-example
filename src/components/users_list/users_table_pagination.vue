<template>
  <table class="users__list__pagination">
    <tr class="pagination__wrapper">
      <td
          v-for='page in pages_data'
          :key='page'
          @click="pageClick(page)"
      >
                <span
                    class="pagination__item selected">{{page}}
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

<style lang='scss'>
  .users__list__pagination {
    display: flex;
    justify-content: center;
    align-items: center;

    .pagination__wrapper {
      margin-left: auto;
      margin-right: auto;

      .pagination {
        &__item {
          float: none;
          display: inline-block;
          vertical-align: top;
          margin: 0 2px;
          cursor: pointer;
          width: auto;
          padding: 8px;
          border-radius: 4px;
          text-align: center;
          font-size: 16px;
          font-weight: 100;
          text-decoration: none !important;
          color: #000 !important;

          &.selected {
            color: #fff !important;
            background-color: #7186BD;
          }

          &:hover {
            background-color: rgb(135, 160, 224);
          }
        }
      }
    }
  }
</style>