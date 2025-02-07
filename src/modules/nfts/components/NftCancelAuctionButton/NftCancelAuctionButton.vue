<template>
    <div class="nftcancelauctionbutton">
        <a-button
            :label="$t('nftcancelauction.cancelAuction')"
            :loading="txStatus === 'pending'"
            :disabled="!canCancelAuction"
            :data-tooltip="!canCancelAuction ? $t('nftcancelauction.highestBidAboveReservePrice') : null"
            @click.native="onButtonClick"
        />

        <a-sign-transaction :tx="tx" @transaction-status="onTransactionStatus" />
    </div>
</template>

<script>
import AButton from '@/common/components/AButton/AButton.vue';
import ASignTransaction from '@/common/components/ASignTransaction/ASignTransaction.vue';
import Web3 from 'web3';
import contracts from '@/utils/artion-contracts-utils.js';
import { toBigNumber } from '@/utils/big-number.js';

export default {
    name: 'NftCancelAuctionButton',

    components: { ASignTransaction, AButton },

    props: {
        token: {
            type: Object,
            default() {
                return {};
            },
        },
        /** @type {Auction} */
        auction: {
            type: Object,
            default() {
                return {};
            },
        },
    },

    data() {
        return {
            tx: {},
            txStatus: '',
        };
    },

    computed: {
        canCancelAuction() {
            return !this.token._inEscrow || this.lastBidIsBelowReservePrice;
        },

        lastBidIsBelowReservePrice() {
            const { lastBid } = this.auction;

            if (lastBid) {
                return toBigNumber(lastBid).isLessThan(this.auction.reservePrice);
            }

            return true;
        },
    },

    methods: {
        cancelAuction() {
            const web3 = new Web3();
            const { token } = this;

            if (!token || !token.contract) {
                return;
            }

            this.tx = contracts.cancelAuction(token.contract, token.tokenId, web3, this.auction.auctionHall);
        },

        onButtonClick() {
            this.cancelAuction();
        },

        onTransactionStatus(payload) {
            this.txStatus = payload.status;

            if (this.txStatus === 'success') {
                this.$notifications.add({
                    text: this.$t('nftcancelauction.cancelSuccessful'),
                    type: 'success',
                });

                this.$emit('tx-success');
            }
        },
    },
};
</script>
