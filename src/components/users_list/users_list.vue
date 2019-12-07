<template>
    <table class="users_list">
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
              <i class="user_points_icon"></i> {{user.points_earned}}
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

<style>

</style>