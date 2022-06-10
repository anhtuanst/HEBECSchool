import { action, computed, makeAutoObservable, observable } from "mobx";
import request from "../utils/request";

export const apiBook = {
    getCategories: () => request({
        url: "/v1/customer/category?limit=12",
        method: "GET"
    }),
    getCategoryHightlight: () => request({
        url: "/v1/customer/category/highlight",
        method: "GET"
    }),
    getBooks: ( page: number,categoryId: number, search: string) => request({
        url: "/v1/customer/book",
        method: "GET",
        params: {
            page: page,
            categoryId: categoryId,
            search: search
        }
    }),
    getBook: (id: number) => request({
        url: `/v1/customer/book/${id}`,
        method: "GET"
    }),
    getBookRelations: (id: number) => request({
        url: `/v1/customer/book/${id}/relations?limit=10`,
        method: "GET"
    })
    };

    class Store {
        constructor(){
            makeAutoObservable(this)
        }

        @observable categories: any[] = [];
        @observable categoryHightlight: any[] = [];
        @observable books: any[] = [];
        @observable book: any = {};
        @observable bookRelations: any[] = [];
        @observable booksCount: number = 0;
        @observable isLoadingCategories: boolean = false;
        @observable isLoadingBooks: boolean = false;
        @observable page: number = 1;
        @observable isLoadingMore:boolean = false;


        @computed get getCategories(){
            return this.categories;
        }
        @computed get getCategoryHightlight(){
            return this.categoryHightlight;
        }
        @computed get getBooks(){
            return this.books;
        }
        @computed get getBook(){
            return this.book;
        }
        @computed get getBookRelations(){
            return this.bookRelations;
        }
        @computed get getBooksCount(){
            return this.booksCount;
        }
        @computed get getIsLoadingCategories(){
            return this.isLoadingCategories;
        }
        @computed get getIsLoadingBooks(){
            return this.isLoadingBooks;
        }
        @computed get getPage(){
            return this.page;
        }
        @computed get getIsLoadingMore(){
            return this.isLoadingMore;
        }

        @action 
         setCategories = async (categories: any[]) => {
            this.isLoadingCategories = true;
            const res = await apiBook.getCategories();
            this.categories = res.data.categories;
            this.isLoadingCategories = false;
        }
        @action
        setCategoryHightlight = async (categoryHightlight: any[]) => {
            const res = await apiBook.getCategoryHightlight();
            this.categoryHightlight = res.data;
        }
        @action
        setBooks = async (categoryId: number, search: string) => {
            const res = await apiBook.getBooks(1,categoryId, search);
            this.books = res.data.data;
            this.booksCount = res.data.total;
        }
        @action
        setBook = async (id: number) => {
            const res = await apiBook.getBook(id);
            this.book = res.data;
        }
        @action
        setBookRelations = async (id: number) => {
            const res = await apiBook.getBookRelations(id);
            this.bookRelations = res.data.books;
        }
        @action
        loadMoreBooks = async (categoryId: number, search: string) => {
            this.isLoadingMore = true;
            if(this.books.length < this.booksCount){
            this.page += 1;
            const res = await apiBook.getBooks(this.page,categoryId, search);
            this.books = [...this.books, ...res.data.data];
            }
            this.isLoadingMore = false;
        }
    }
    const bookStore = new Store();
    export default bookStore;

