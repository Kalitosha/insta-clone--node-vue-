<template lang="pug">
    .header
        .container
            .header__row
                a.header__logo(href='index.html')
                    i.fab.fa-dev
                .header__search
                    .search
                        input(type='text', placeholder='Поиск')
                        .search__cancel.search__cancel--active
                            i.fas.fa-times-circle
                .header__links
                    router-link.header__link(to='/account')
                        i.fas.fa-user
                    router-link.header__link(v-if="isAuthenticated" to='/post/create')
                        i.fas.fa-paper-plane
</template>