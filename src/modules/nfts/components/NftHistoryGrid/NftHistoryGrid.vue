<template>
    <div class="nfthistorygrid">
        <f-data-grid
            ref="grid"
            infinite-scroll
            infinite-scroll-root=".nfttmpgrid .fdatagrid_table"
            strategy="remote"
            no-header
            max-height="400px"
            sticky-head
            class="agrid"
            :items="items"
            :columns="itemsColumns"
            :total-items="totalItems"
            :per-page="perPage"
            @change="_onGridPageChange"
        >
            <template #column-unitPrice="{ item, value }">
                <a-token-value
                    :token="item.payToken"
                    :value="value"
                    :fraction-digits="2"
                    :use-placeholder="false"
                    no-symbol
                />
            </template>
            <template #column-fromUser="{ value }">
                <router-link :to="{ name: 'account', params: { address: value.address } }">
                    <a-address :address="value.address" :name="value.username" :image="value.avatarThumb" is-account />
                </router-link>
            </template>
            <template #column-toUser="{ value }">
                <router-link v-if="value !== null" :to="{ name: 'account', params: { address: value.address } }">
                    <a-address :address="value.address" :name="value.username" :image="value.avatarThumb" is-account />
                </router-link>
            </template>
            <template #column-time="{ value }">
                <div>
                    {{ value }}
                </div>
            </template>
        </f-data-grid>
    </div>
</template>
<script>
import FDataGrid from 'fantom-vue-components/src/components/FDataGrid/FDataGrid.vue';
import ATokenValue from '@/common/components/ATokenValue/ATokenValue.vue';
import AAddress from '@/common/components/AAddress/AAddress.vue';
import { getTokenActivity } from '@/modules/nfts/queries/token-activity.js';
import { datetimeFormatter } from '@/utils/formatters.js';
import { dataPageMixin } from '@/common/mixins/data-page.js';
import { objectEquals } from 'fantom-vue-components/src/utils';

const filter = ['LISTING_SOLD', 'OFFER_SOLD', 'AUCTION_RESOLVED'];

export default {
    name: 'NftHistoryGrid',

    components: { FDataGrid, AAddress, ATokenValue },

    mixins: [dataPageMixin],

    props: {
        token: {
            type: Object,
            default() {
                return {};
            },
        },
    },

    data() {
        const _this = this;
        return {
            itemsColumns: [
                {
                    name: 'unitPrice',
                    label: this.$t('nfthistorygrid.price'),
                },
                {
                    name: 'type',
                    label: this.$t('nfthistorygrid.type'),
                    formatter(value) {
                        return _this.$t('nfthistorygrid.types.' + value);
                    },
                },
                {
                    name: 'fromUser',
                    label: this.$t('nfthistorygrid.from'),
                },
                {
                    name: 'toUser',
                    label: this.$t('nfthistorygrid.to'),
                },
                {
                    name: 'time',
                    label: this.$t('nfthistorygrid.date'),
                    formatter(value) {
                        return datetimeFormatter(value);
                    },
                },
            ],
            perPage: 40,
        };
    },

    watch: {
        token: {
            async handler(value, oldValue) {
                if (value.contract && !objectEquals(value, oldValue)) {
                    if (this.items.length > 0) {
                        this.update();
                    } else {
                        await this.loadActivities();
                    }
                }
            },
            immediate: true,
        },
    },

    methods: {
        async loadPage(pagination = { first: this.perPage }) {
            const { token } = this;

            return await getTokenActivity(token.contract, token.tokenId, pagination, this.filterToQuery(filter));
        },

        async loadActivities() {
            await this._loadPage();
        },

        filterToQuery(value) {
            if (value) {
                return { filter: { types: value } };
            }
            return {};
        },

        update() {
            setTimeout(() => {
                this._resetData();
                this.$refs.grid.reload();
            }, 500);
        },
    },
};
</script>

<style lang="scss">
@use 'style';
</style>
