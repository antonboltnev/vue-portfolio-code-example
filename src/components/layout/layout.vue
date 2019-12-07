<template>
     <div class="content_wrapper">
    <div class="content_wrapper_inner">
      <div class="route_title">
        <h1>Clients</h1>
      </div>
      <!-- Filters section -->
      <div class="filters_wrapper">
        <div class="filters_list">
          <div class="filters_list_field">
            <input class="query_input" type="text" placeholder="Search by name" v-model='searchFieldValue'>
          </div>
          <div class="filters_list_field">
            <div class="filters_list_field_label type_date">
              <span class="form_search_param_label">Registration date</span>
            </div>
            <label class="filters_list_field_input">
              <div class="date_picker_wrapper">
                <masked-input class="input_simple" v-model="minDate" mask="1111-11-11" placeholder="Enter date from" />
              </div>
            </label>
            <label class="filters_list_field_input">
              <div class="date_picker_wrapper">
                <masked-input class="input_simple" v-model="maxDate" mask="1111-11-11" placeholder="Enter date to" />
              </div>
            </label>
          </div>
          <div class="filters_list_field">
            <a 
              href="" 
              onClick='return false;' 
              class="filter_field_expand" 
              :class="{'open' : isPointsFilterVisible}" 
              style="" 
              @click="togglePointsFilter"
            >
              <span 
              class="filter_field_expand_label"
              >Points
              </span>
            </a>
          </div>
          <div class="filters_list_field no_wrap" style="padding-left: 20px;" v-if='isPointsFilterVisible'>
            <div class="filters_list_field_label">
              <span class="form_search_param_label">Points earned</span>
            </div>
            <div class="slider_wrap">
              <div class="slider_inputs_wrap">
                <div class="range-slider">
              <input @change="setRangeCircles" v-model.number="minPoints" min="0" max="5000" step="100" type="range" />
              <input @change="setRangeCircles" v-model.number="maxPoints" min="0" max="5000" step="100" type="range" />
            </div>
                <div class="slider_inputs_placeholder">
                  {{minPoints}} — {{maxPoints}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="filters_footer">
          <div class="filters_footer_inner clearfix">
            <span class="filters_footer_count">
              {{filteredUsers.length}} client(-s)
            </span>
            <button type="button" class="search_button" @click="applyFilters(searchFieldValue)">Search</button>
            <button type="button" class="reset_button" @click="clearFilters">Clear</button>
          </div>
        </div>
      </div>
      <!-- Users list section -->
      <div class="users_list_wrapper">
        <users-list 
          :users_data='paginatedUsers'
          @sortByName='sortByName'
          @sortByDate='sortByDate'
          @sortByPoints='sortByPoints'
      /> 
        <div class="pagination_wrapper">
          <users-table-pagination 
            :pages_data='pages'
            @pageClick='pageClick'
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import usersList from '../users_list/users_list'
import usersTablePagination from '../users_list/users_table_pagination'
import {mapActions, mapGetters} from 'vuex'
import MaskedInput from 'vue-masked-input'
import { resolve } from 'path';

export default {
    name: 'layout',
    components: {
      usersList,
      usersTablePagination,
      MaskedInput
    },
    data() {
      return {
          minPoints: 0, //min range filter value
          maxPoints: 5000, //min range filter value
          minDate: '2013-09-10', //min date value
          maxDate: '2020-11-10', //max date value
          pageNum: 1, //default page number
          usersPerPage: 10, // users per page
          isPointsFilterVisible: true, //points filter visibility
          searchFieldValue: '', //text filter value
          filteredUsers: [], //array of users with applied filters
      }
    },
    computed: {
      ...mapGetters([
        'USERS' //users Getter
      ]),
      pages() {
        // pages count
        if (this.filteredUsers.length) {
          return Math.ceil(this.filteredUsers.length / this.usersPerPage);
        } else {
          return Math.ceil(this.USERS.length / this.usersPerPage);
        }
      },
      paginatedUsers(){
        //slice users by pages
        let from = (this.pageNum - 1) * this.usersPerPage;
        let to = from + this.usersPerPage;
        if (this.filteredUsers.length) {
          return this.filteredUsers.slice(from, to);
        } else {
          return this.USERS.slice(from, to);
        }
}
    },
    methods: {
      ...mapActions([
        'GET_USERS_FROM_API' 
      ]),
      togglePointsFilter() {
        this.isPointsFilterVisible = !this.isPointsFilterVisible;
      },
      setRangeCircles: function() {
        if (this.minPoints > this.maxPoints) {
          var tmp = this.maxPoints;
          this.maxPoints = this.minPoints;
          this.minPoints = tmp;
        }
      },
      applyFilters(value) {
        // filtering
        let vm = this;
        if (value) {
          // filter by firt and last name
          this.filteredUsers = [];
          this.USERS.map(function (item) {
            if (item.name.toLowerCase().includes(value.toLowerCase()) && item.points_earned >= vm.minPoints && item.points_earned <= vm.maxPoints) {
                vm.filteredUsers.push(item);
            }
          })
        } else {
          // filter by points
            this.filteredUsers = [];
            return new Promise(resolve => {
              this.USERS.map(function (item) {
                if (item.points_earned >= vm.minPoints && item.points_earned <= vm.maxPoints) {
                    vm.filteredUsers.push(item);
                }
              })
              resolve()
            })
            .then(() => {
              // filter by date
              if (vm.minDate || vm.maxDate) {
                let max = new Date(vm.maxDate).getTime();
                let min = new Date(vm.minDate).getTime();
                vm.filteredUsers = vm.filteredUsers.filter(e => {
                  var date = new Date(e.registration_date).getTime();
                  if (date >= min && date <= max) {
                    return e;
                  }
                });
              }
            })
        }
      },
      pageClick(pageNum) {
        //page switch
        this.pageNum = pageNum;
      },
      sortByName() {
        //sort by name
        let users = this.USERS;
        if (this.filteredUsers.length) {
          users = this.filteredUsers;
        }
        users.sort((a, b) => a.name.localeCompare(b.name));
      },
      sortByPoints() {
        //sort by points
        let users = this.USERS;
        if (this.filteredUsers.length) {
          users = this.filteredUsers;
        } 
        users.sort((a, b) => a.points_spent - b.points_spent);
      },
      sortByDate() {
        //sort by date
        if (this.filteredUsers.length) {
          this.filteredUsers.sort((a, b) => a.registration_date.localeCompare(b.registration_date));
        } else {
          this.USERS.sort((a, b) => a.registration_date.localeCompare(b.registration_date));
        }
      },
      clearFilters() {
        //clear filters
        this.minPoints = 0;
        this.maxPoints = 5000;
        this.searchFieldValue = '';
        this.applyFilters();
        this.minDate = '',
        this.maxDate = ''
      }
  },
  created() {
    //get users from api
    this.GET_USERS_FROM_API();
  }
}
</script>

<style>

</style>