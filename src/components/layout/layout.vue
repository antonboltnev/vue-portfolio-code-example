<template>
  <div class="content_wrapper">
    <div class="content_wrapper__inner">
      <div class="route__title">
        <h1>Clients</h1>
      </div>
      <!-- Filters section -->
      <div class="filters__wrapper">
        <div class="filters__list">
          <div class="filters__list_field">
            <input class="query__input" type="text" placeholder="Search by name" v-model='searchFieldValue'>
          </div>
          <div class="filters__list_field">
            <div class="filters__list_field_label type_date">
              <span class="form_search__param_label">Registration date</span>
            </div>
            <label class="filters__list_field_input">
              <div class="date_picker__wrapper">
                <masked-input class="input_simple" v-model="minDate" mask="1111-11-11"
                              placeholder="Enter date from"/>
              </div>
            </label>
            <label class="filters__list_field_input">
              <div class="date_picker__wrapper">
                <masked-input class="input_simple" v-model="maxDate" mask="1111-11-11"
                              placeholder="Enter date to"/>
              </div>
            </label>
          </div>
          <div class="filters__list_field">
            <a
                href=""
                onClick='return false;'
                class="filter_field_expand"
                :class="{'open' : isPointsFilterVisible}"
            >
              <span
                  class="filter_field_expand_label"
                  @click="togglePointsFilter"
              >Points
              </span>
            </a>
          </div>
          <div class="filters__list_field no_wrap" style="padding-left: 20px;" v-if='isPointsFilterVisible'>
            <div class="filters__list_field_label">
              <span class="form_search__param_label">Points earned</span>
            </div>
            <div class="slider_wrap">
              <div class="slider_inputs__wrap">
                <div class="range-slider">
                  <input @change="setRangeCircles" v-model.number="minPoints" min="0" max="5000"
                         step="100" type="range"/>
                  <input @change="setRangeCircles" v-model.number="maxPoints" min="0" max="5000"
                         step="100" type="range"/>
                </div>
                <div class="slider_inputs__placeholder">
                  {{minPoints}} — {{maxPoints}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="filters__footer">
          <div class="filters__footer_inner clearfix">
            <span class="filters__footer_count">
              {{filteredUsers.length ? filteredUsers.length : USERS.length}} client(-s)
            </span>
            <button type="button" class="search_button" @click="applyFilters(searchFieldValue)">Search
            </button>
            <button type="button" class="reset_button" @click="clearFilters">Clear</button>
          </div>
        </div>
      </div>
      <!-- Users list section -->
      <div class="users_list__wrapper">
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
      paginatedUsers() {
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
      setRangeCircles: function () {
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
            });
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

<style lang='scss'>

  body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    background-color: $body_background;
  }

  .content_wrapper {
    text-align: center;
    font-family: $main_font;

    &__inner {
      display: inline-block;
      width: 100%;
      max-width: 960px;
      padding: 0 0 100px 0;
      margin: 0 auto;
      text-align: left;

      .route__title {
        h1 {
          font-weight: 200;
          font-size: 42px;
          line-height: 100%;
          margin: 30px 0;
        }
      }
    }
  }

  .users_list__wrapper {
    margin-top: 40px;
  }

  .pagination_wrapper {
    text-align: center;
    margin-top: 40px;
  }

  .list_pagination__wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 670px;
  }

  .no_wrap {
    white-space: nowrap;
  }

  .clearfix:after {
    content: "";
    display: table;
    clear: both;
  }

  // filters
  .filters__wrapper {
    box-shadow: 0 9px 12px 0 #c1c1c1;
    border-radius: $padding/2;
  }

  .filters__list {
    background-color: $lightWhite;
    border-radius: $padding/2;
    padding: 20px 50px;

    &_field {
      margin: 20px 0 20px 0;
      display: inline-block;
      width: 100%;
      box-sizing: border-box;

      &_field_input {
        display: inline-block;
      }
    }

    &_field_label {
      display: inline-block;
      vertical-align: top;
      line-height: 22px;
      width: 28%;
      font-weight: 300;
      text-align: left;

      span {
        font-size: 16px;
      }
    }

    .query__input {
      display: block;
      width: 100%;
      box-sizing: border-box;
      height: 40px;
      padding: 0 10px;
      font-weight: 300;
      font-family: 'Roboto', Arial, sans-serif;
      font-size: 16px;
      box-shadow: 0 1px 1px #ccc inset;
      border-radius: 2px;
      border: none;

      &:focus {
        outline: none;
      }

      &::-webkit-input-placeholder {
        color: #d3d3d3
      }

      &:-moz-placeholder {
        color: #d3d3d3
      }

      &::-moz-placeholder {
        color: #d3d3d3
      }

      &:-ms-input-placeholder {
        color: #d3d3d3
      }
    }

    .filter_field_expand {
      font-size: 16px;
      font-weight: 300;
      padding-left: 20px;
      position: relative;
      display: block;
      color: #000;
      text-decoration: none !important;
      -webkit-transition: color 0.15s ease;
      -moz-transition: color 0.15s ease;
      -o-transition: color 0.15s ease;
      transition: color 0.15s ease;
      cursor: default;

      &_label {
        cursor: pointer;
      }

      &:hover {
        color: #6E9FEE;
      }

      &.open:before {
        transform: rotate(-180deg);
        transition: all ease .3s;
      }

      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 8px;
        -webkit-transition: all 0.3s ease;
        -moz-transition: all 0.3s ease;
        -o-transition: all 0.3s ease;
        transition: all 0.3s ease;
        display: inline-block;
        width: 0;
        height: 0;
        border-bottom: none;
        border-left: 6px solid transparent !important;
        border-right: 6px solid transparent !important;
        border-top: 6px solid #000;
      }

      .filter_field_expand_label {
        font-size: 18px;
      }
    }

    .slider_wrap {
      display: inline-block;
      width: auto;
      white-space: nowrap;
      max-width: 70%;
      vertical-align: top;
      margin-top: 5px;
      margin-left: 20px;

      .slider_simple {
        display: inline-block;
        width: 400px;
        margin-right: 60px;
        vertical-align: top;
        height: 4px !important;
        background: #dcdcd9 !important;
        margin-top: 5px;
        position: relative;
        border-radius: 0 !important;
      }

      .slider_inputs__wrap {
        vertical-align: top;
        display: flex;
        position: relative;
        top: -8px;

        .slider_inputs__placeholder {
          line-height: 30px;
          font-weight: 300;
          font-size: 16px;
        }
      }

      .ui-slider-range {
        height: 4px !important;
        background: #7084b6 !important;
        position: absolute !important;
        border: none !important;
      }

      .ui-slider-handle {
        position: absolute;
        width: 30px;
        height: 30px;
        border-radius: 30px;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
        background: #ffffff !important;
        margin-top: -15px;
        margin-left: -16px;
        outline: none;
        border: 1px solid #fff;

        &:hover {
          border: 1px solid #ddd;
        }
      }
    }

    //datepickers
    .date_picker__wrapper {
      display: inline-block;
      margin: 0 4px;
      position: relative;
      min-width: 100px;
      width: auto;
      vertical-align: top;

      .input_simple {
        line-height: 40px;
        height: 40px;
        width: 100%;
        font-size: 14px;
        font-weight: 300;
        background: #dcdcd9;
        border: none !important;
        box-shadow: none;
        border-radius: 0;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        font-family: 'Roboto', Arial, sans-serif;
        outline: none;
        padding: 0 10px;
      }
    }

    .filters__list_field_label.type_date {
      margin-top: 8px;
    }
  }

  .filters__footer {
    border-radius: $padding/2;
    padding: 0 50px;
    background-color: $lightWhite;

    &_inner {
      border-top: 2px solid $darkWhite;
      padding: 20px 0;
    }

    &_count {
      float: left;
      margin-top: 10px;
    }

    button {
      float: right;
    }

    .reset_button {
      min-width: 94px;
      display: inline-block;
      font-size: 16px;
      font-weight: 100;
      color: #000 !important;
      background-color: #ffffff;
      border: 1px solid #fff;
      padding: 9px 15px 9px;
      -webkit-transition: all 0.15s ease;
      -moz-transition: all 0.15s ease;
      -o-transition: all 0.15s ease;
      transition: all 0.15s ease;
      text-align: center;
      text-decoration: none !important;
      white-space: nowrap;
      border-radius: 50px;
      outline: none;
      cursor: pointer;
      line-height: 100%;
      box-sizing: border-box;

      &:hover {
        background-color: #f0f0f0;
      }
    }

    .search_button {
      margin-left: 13px;
      min-width: 107px;
      padding: 10px 15px;
      display: inline-block;
      font-size: 16px;
      font-weight: 100;
      color: #fff !important;
      border-radius: 50px;
      -webkit-transition: all 0.15s ease;
      -moz-transition: all 0.15s ease;
      -o-transition: all 0.15s ease;
      transition: all 0.15s ease;
      text-align: center;
      background-color: #7084b6;
      text-decoration: none !important;
      white-space: nowrap;
      border: none !important;
      cursor: pointer;
      outline: none;
      line-height: 100%;
      font-family: 'Roboto', sans-serif;

      &:hover {
        background-color: rgb(135, 160, 224);
      }
    }

  }

  /* Styles for range slider */
  .range-slider {
    width: 300px;
    margin: auto 16px;
    text-align: center;
    position: relative;
  }

  .range-slider svg,
  .range-slider input[type=range] {
    position: absolute;
    left: 0;
    bottom: 0;
  }

  input[type=number] {
    border: 1px solid #ddd;
    text-align: center;
    font-size: 1.6em;
    -moz-appearance: textfield;
  }

  input[type=number]::-webkit-outer-spin-button,
  input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input[type=number]:invalid,
  input[type=number]:out-of-range {
    border: 2px solid #ff6347;
  }

  input[type=range] {
    -webkit-appearance: none;
    width: 100%;
  }

  input[type=range]:focus {
    outline: none;
  }

  input[type=range]:focus::-webkit-slider-runnable-track {
    background: #7084b6;
  }

  input[type=range]:focus::-ms-fill-lower {
    background: #ffffff;
  }

  input[type=range]:focus::-ms-fill-upper {
    background: #ffffff;
  }

  input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    cursor: pointer;
    animate: 0.2s;
    background: #7084b6;
    border-radius: 1px;
    box-shadow: none;
    border: 0;
  }

  input[type=range]::-webkit-slider-thumb {
    z-index: 2;
    position: relative;
    top: -7px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
    border: 1px solid #ffffff;
    height: 32px;
    width: 32px;
    border-radius: 25px;
    background: #ffffff;
    cursor: pointer;
    -webkit-appearance: none;
    outline: none;
    margin-top: -7px;
  }
</style>