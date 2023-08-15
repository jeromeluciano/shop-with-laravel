export default function useFormatCurrency() {
    function formatCurrency(amount) {
        amount = amount / 100;
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'PHP'});
    }

    return formatCurrency;
}
