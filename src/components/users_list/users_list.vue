<template>
  <table class="users__list">
    <tr>
      <th @click="sortByName">
        <div>First and last name</div>
      </th>
      <th @click="sortByDate">
        <div>Registration date</div>
      </th>
      <th @click="sortByPoints">
        <div>Points</div>
      </th>
    </tr>
    <tr
        v-for='user in users_data'
        :key='user.id'
    >
      <td>
        {{user.name}}
      </td>
      <td>
        {{user.registration_date}}
      </td>
      <td>
        <i class="user__points_icon"></i> {{user.points_earned}}
      </td>
    </tr>
  </table>
</template>

<script>
  export default {
    name: 'users-list',
    props: {
      users_data: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      sortByName() {
        this.$emit('sortByName');
      },
      sortByDate() {
        this.$emit('sortByDate');
      },
      sortByPoints() {
        this.$emit('sortByPoints');
      }
    }
  }
</script>

<style lang='scss'>

  .users__list {
    width: 100%;
    border-collapse: collapse;

    th {
      background-color: $lightWhite;
      padding: 20px 0 20px 20px;
      font-weight: 300;
      cursor: pointer;

      &:last-child {
        padding: 20px;

        div {
          border-right: none;
        }
      }

      div {
        border-right: 1px solid $lightGray;
      }
    }

    td {
      padding: 20px 0 20px 20px;
      font-weight: 300;
      border-bottom: 1px solid $darkWhite;

      &:last-child {
        padding: 20px;
      }
    }

    tr:last-child {
      td {
        border-bottom: none;
      }
    }

    .user__points_icon {
      display: inline-block;
      position: relative;
      top: 4px;
      margin-right: 5px;
      width: 20px;
      height: 20px;
      background: url(./icon_points.svg) no-repeat;
    }
  }

</style>