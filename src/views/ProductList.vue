<template>
    <div class="product-list">
      <!-- 搜索和筛选区域 -->
      <div class="search-filter">
        <!-- 搜索框 -->
        <el-input
          placeholder="搜索商品"
          v-model="searchKeyword"
          @change="handleSearch"
          style="width: 300px;"
        >
          <i slot="prefix" class="el-icon-search"></i>
        </el-input>
        <!-- 筛选条件 -->
        <!-- 类别筛选 -->
        <el-select v-model="selectedCategory" placeholder="选择类别" @change="handleFilter">
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          ></el-option>
        </el-select>
        <!-- 价格区间筛选 -->
        <el-input-number
          v-model="priceRange.min"
          @change="handleFilter"
          :min="0"
          placeholder="最低价"
        ></el-input-number>
        <span>-</span>
        <el-input-number
          v-model="priceRange.max"
          @change="handleFilter"
          :min="0"
          placeholder="最高价"
        ></el-input-number>
        <!-- 重置筛选 -->
        <el-button @click="resetFilter">重置筛选</el-button>
      </div>
      <!-- 商品展示区域 -->
      <el-row :gutter="20">
        <el-col :span="6" v-for="product in products" :key="product.id">
          <el-card :body-style="{ padding: '10px' }" class="product-card">
            <img :src="product.img" class="product-image" @click="goToDetail(product.id)" />
            <div class="product-info">
              <!-- <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-price">￥{{ product.price }}</p> -->
              <h3>{{ product.name }}</h3>
              <p>{{ product.title }}</p>
              <p>{{ product.detail }}</p>
              <p>{{ product.price }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- 分页控件 -->
      <div class="pagination">
        <el-pagination
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProductList',
    data() {
      return {
        searchKeyword: '',
        selectedCategory: '',
        priceRange: {
          min: 0,
          max: 100
        },
        categories: [], // 类别列表，从后端获取
        products: [], // 商品列表
        currentPage: 1,
        pageSize: 12,
        total: 0
      };
    },
    mounted() {
      this.fetchCategories();
      this.fetchProducts();
    },
    methods: {
        fetchProducts() {
        const params = {
        page: this.currentPage,
        size: this.pageSize,
        keyword: this.searchKeyword,
        category: this.selectedCategory,
        priceMin: this.priceRange.min,
        priceMax: this.priceRange.max
        };
        this.$axios.get('/api/products', { params })
        .then(response => {
            if (response.data.code === 200) {
              this.products = response.data.data.content;
              this.total = response.data.data.totalElements;
            } else {
              this.$message.error(response.data.message);
            }
        })
        .catch(error => {
            console.error(error);
            this.$message.error('获取商品列表失败');
        });
      },
      handleSearch() {
        this.currentPage = 1;
        this.fetchProducts();
      },
      handleFilter() {
        this.currentPage = 1;
        this.fetchProducts();
      },
      resetFilter() {
        this.searchKeyword = '';
        this.selectedCategory = '';
        this.priceRange.min = 0;
        this.priceRange.max = 100;
        this.handleFilter();
      },
      handlePageChange(page) {
        this.currentPage = page;
        this.fetchProducts();
      },
      goToDetail(productId) {
        this.$router.push(`/product/${productId}`);
      },
      fetchCategories() {
        this.$axios.get('/api/categories')
            .then(response => {
              console.log(response);
            if (response.data.code === 200) {
                this.categories = response.data.data;
                console.log(this.categories);
            } else {
                this.$message.error(response.data.message);
            }
            })
            .catch(error => {
            console.error(error);
            this.$message.error('获取类别列表失败');
            });
        }
    }
  };
  </script>
  
  <style scoped>
  .product-list {
    padding: 20px;
  }
  .search-filter {
    margin-bottom: 20px;
  }
  .product-card {
    cursor: pointer;
    margin-bottom: 20px;
  }
  .product-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  .product-info {
    text-align: center;
  }
  .product-name {
    font-size: 16px;
    margin: 10px 0;
  }
  .product-price {
    color: red;
    font-size: 18px;
  }
  .pagination {
    text-align: center;
    margin-top: 20px;
  }
  </style>
  