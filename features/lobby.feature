Feature: Lobby
    As a Visitor
    I want a Lobby
    In order to join a game

    Scenario: Enter the Lobby
        Given I am a new user
        When I load pongy
        Then I should be in the Lobby

    Scenario: Two players join a game
        Given 2 players in the Lobby
        When player-1 offers to join a game
        And player-2 offers to join a game
        Then player-1 should be in game 1
        And player-2 should be in game 1

    Scenario: Three players join a game
        Given 3 players in the Lobby
        When player-1 offers to join a game
        And player-2 offers to join a game
        And player-3 offers to join a game
        Then player-1 should be in game 1
        And player-2 should be in game 1
        And player-3 should not be in a game

    Scenario: Four players join a game
        Given 4 players in the Lobby
        When player-1 offers to join a game
        And player-2 offers to join a game
        And player-3 offers to join a game
        And player-4 offers to join a game
        Then player-1 should be in game 1
        And player-2 should be in game 1
        And player-3 should be in game 2
        And player-4 should be in game 2

