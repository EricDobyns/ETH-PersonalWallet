$(document).ready(function() {

    // Get Web3 Provider
    if(typeof web3 !== 'undefined') {
        console.log('current provider');
        web3 = new Web3(web3.currentProvider);  
    } else {
        console.log('test net');
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    // Check if Web3 is Connected
    if (!web3.isConnected()) {
        console.error("Not connected");
    }

    web3.eth.getAccounts(function(err, accounts) { 
        if (accounts.length < 1) {
            return
        }

        // Get Main Account
        var accountAddress1 = accounts[0];
        document.getElementById("accountAddress").innerHTML = accountAddress1;

        // Get Eth Balance
        web3.eth.getBalance(accountAddress1, function (error, result) {
            if (!error) {
                var formattedBalance = web3.fromWei(result.toNumber(), 'ether');
                document.getElementById("accountBalance").innerHTML = formattedBalance;

                // Get Balance in USD
                $.getJSON('https://etherchain.org/api/basic_stats', function(response) {
                    var ethPerUsd = response.data.price.usd;
                    var usdValue = formattedBalance * ethPerUsd;
                    document.getElementById("accountBalanceUsd").innerHTML = '$' + usdValue + ' (~ ' + ethPerUsd + '/ETH)';
                })
            }
        })



        // Get Transactions
        $.getJSON('https://etherchain.org/api/account/' + accountAddress1 + '/tx/0', function(response) {
            document.getElementById('numberOfTransactions').innerHTML = response.data.length + ' txn';

            $.each(response.data, function(i, tx) {
                var txFee = tx.gasUsed * tx.price;

                $("#transactionsTable")
                .append($('<tr>')
                    .append($('<td>').text(tx.hash))
                    .append($('<td>').text(tx.block_id))
                    .append($('<td>').text(tx.time))
                    .append($('<td>').text(tx.sender))
                    .append($('<td>').text(tx.recipient))
                    .append($('<td>').text(web3.fromWei(tx.amount, 'ether')))
                    .append($('<td>').text(web3.fromWei(txFee, 'ether')))
                );
            })
        })
    })
})