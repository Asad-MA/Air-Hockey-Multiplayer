jQuery(document).ready(function ($) {
    // Initialize the dashboard page
    console.log("Dashboard page initialized");

    // Example: Fetch and display user data
    function fetchUserData() {
        $.ajax({
            url: '/api/user/data',
            method: 'GET',
            success: function (data) {
                $('#user-data').html(JSON.stringify(data));
            },
            error: function (error) {
                console.error("Error fetching user data:", error);
            }
        });
    }


    function getDashboardStats() {
        $.ajax({
            url: '/api/stats/dashboard/mini',
            method: 'GET',
            success: function (data) {
                $('[data-games-played]').text(data.totalGames);
                $('[data-win]').text(data.totalWins);
                $('[data-lose]').text(data.totalLosses);
                $('[data-win-per]').text(data.winPercentage + '%');
                $('[data-win-streak]').text(data.winningStreak);
                $('[data-last-game]').text(data.lastGameStatus);
            },
            error: function (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        });
    }

    async function fetchLeaderboard({
        period = 'all',       // 'daily', 'weekly', 'monthly', 'all'
        sortBy = 'totalCoins',// 'totalCoins', 'winRate', etc.
        page = 1,
        limit = 10
    } = {}) {
        try {
            const query = new URLSearchParams({ period, sortBy, page, limit });
            const response = await fetch(`/api/leaderboard?${query.toString()}`);

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            return data; // { total, page, limit, players: [...] }

        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
            return null;
        }
    }


    fetchLeaderboard({ period: 'weekly', sortBy: 'totalCoins', page: 1, limit: 10 })
        .then(data => {
            if (data) {
                console.log('Leaderboard data:', data);
                $('#top3-weekly').empty();
                data.slice(0, 3).forEach((player , i) => {
                    let className = i==0?'top-ranked-weekly3':'top-runner-up';
                    $('#top3-weekly').append(`
                        <div class="top-player-box ${className}">
                            <div class="player-avatar">
                                <img src="${player.avatar}" class="avatar"
                                    alt="Player Avatar">
                            </div>
                            <div class="top-player-content">
                                <div class="player-meta">
                                ${i==0? '<span class="text-gray text-sm mb-5 d-in-block"><i class="fa-solid fa-star rank-star-pink" aria-hidden="true"></i> Top Ranked</span>': ''}
                                <h3 class="player-d-name heading-xs">${player.displayName}</h3>
                                <!-- <span class="player-u-name">@redflag</span> -->
                            </div>
                            <div class="ui-divider bg-dark-gray"></div>
                            <div class="player-b-stats d-flex gap-30 align-center">
                                <div class="stat-block flex-grow d-flex justify-between align-center" >
                                    <span class="stat-key text-sm text-gray">Games Played:</span>
                                    <span class="stat-value text-sm">${player.gamesPlayed}</span>
                                </div>
                                <div class="divider-vr"></div>
                                <div class="stat-block flex-grow d-flex justify-between align-center">
                                    <span class="stat-key text-sm text-gray">Coin Earned</span>
                                    <span class="stat-value text-sm">${player.totalCoins}</span>
                                </div>
                            </div>
                            </div>
                        </div>
                    `);
                });
                
                // Process and display the leaderboard data as needed
            }
        });

    //Get the match history
    function getMatchHistory({ page = 1, limit = 10, sort = 'recent', result = 'all' }) {
        const query = new URLSearchParams({ page, limit, sort, result });
        $.ajax({
            url: `/api/match-history?${query.toString()}`,
            method: 'GET',
            success: function (data) {
                console.log("Match History:", data);
                // Process and display match history data
            },
            error: function (error) {
                console.error("Error fetching match history:", error);
            }
        });
    } 

    // Call the function to get match history
    getMatchHistory({});

    // Call the function to get dashboard stats
    getDashboardStats();
    // Call the function to fetch user data
    fetchUserData();
});