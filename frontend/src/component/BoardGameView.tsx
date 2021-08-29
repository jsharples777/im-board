import React from "react";
import PropTypes from 'prop-types';
import moment from 'moment';
import debug from 'debug';

import controller from "../Controller";
import {Decorator} from "../AppTypes";

const beLogger = debug('view-ts:boardgameview');


// @ts-ignore
export default function BoardGameView({boardGame, showScoresHandler, addToCollectionHandler, removeFromCollectionHandler,startScoreSheetHandler}) {
    if (boardGame) {
        beLogger(`Board Game ${boardGame.gameId}`);

        let addButton = <div>
            <button type="button"
                    className="btn-primary btn-sm rounded p-1 mr-2 mt-1"
                    board-game-id={boardGame.gameId} onClick={addToCollectionHandler}>
                &nbsp;&nbsp;Add to {!controller.isLoggedIn()?'Browser':''} Collection &nbsp;
                <i className="fas fa-star"></i>&nbsp;&nbsp;
            </button>
            <button type="button"
                    className="btn-primary btn-sm rounded p-1 ml-2 mt-1"
                    board-game-id={boardGame.gameId} onClick={removeFromCollectionHandler}>
                &nbsp;&nbsp;Remove from Display&nbsp;<i className="fas fa-trash-alt"></i>
            </button>
            </div>

        let deleteButton =
            <button type="button"
                    className="btn-warning btn-sm rounded p-1 mr-2 mt-1"
                    board-game-id={boardGame.gameId} onClick={removeFromCollectionHandler}>
                &nbsp;&nbsp;Remove from {!controller.isLoggedIn()?'Browser':''} Collection &nbsp;
                <i className="far fa-star"></i>&nbsp;&nbsp;
            </button>

        let startScoreSheetButton =
            <button type="button"
                    className="btn-secondary btn-sm rounded p-1 mr-2 mt-2"
                    board-game-id={boardGame.gameId} onClick={startScoreSheetHandler}>
                &nbsp;&nbsp;Start Score Sheet &nbsp;
                <i className="fas fa-list-alt"></i>&nbsp;&nbsp;
            </button>

        // do we have any scores?
        let scoreCount = 0;
        if (boardGame.scoresheets) {
            scoreCount = boardGame.scoresheets.length;
        }

//        let overlay = <div className="card-img-overlay">
        let favouriteIcon = <i className="fas fa-star text-black"></i>
        let scoreBadge = <span board-game-id={boardGame.gameId} className='badge badge-pill badge-primary ml-1' onClick={showScoresHandler}>{scoreCount}</span>

        if ((boardGame.decorator) && (boardGame.decorator !== Decorator.Incomplete)) {

            return (
                <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 p-2">
                    <div className="card">
                        <a href="https://boardgamegeek.com/boardgame/${boardGame.gameId}" target="_blank"><img className="card-img-top" src={boardGame.image} alt="Card image cap"></img></a>
                        <div className="card-body scroll">
                            <h5 className="card-title">{boardGame.name} ({boardGame.year}) {((boardGame.decorator === Decorator.Persisted) || (boardGame.decorator === Decorator.PersistedLocally))?favouriteIcon:''} {((boardGame.decorator === Decorator.Persisted) || (boardGame.decorator === Decorator.PersistedLocally))?scoreBadge:''}<br/>  {(controller.isLoggedIn())?((boardGame.decorator === Decorator.Persisted)?deleteButton:addButton):deleteButton}</h5>
                            <p className="card-text">{boardGame.description}</p>

                            <p className="card-text">
                                <small className="text-muted">
                                    Play Time: {boardGame.minPlayTime} - {boardGame.maxPlayTime} min<br/>
                                    Players: {boardGame.minPlayers} - {boardGame.maxPlayers} Min Age:
                                    {boardGame.minAge}<br/>
                                    Categories: {boardGame.categories}
                                </small>
                            </p>
                        </div>
                        <div className="card-footer text-right text-muted">
                            Rank: {boardGame.rank} Score: {boardGame.averageScore} from {boardGame.numOfRaters} raters<br/>
                            {startScoreSheetButton}
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 p-2">
                <div className="card">
                    <img className="card-img-top" src="/img/spinner.gif" alt="Card image cap"></img>
                    <div className="card-body">
                        <h5 className="card-title">{boardGame.name} ({boardGame.year}) </h5>
                        <p className="card-text">Loading...</p>
                        <p className="card-text">
                            <small className="text-muted">
                                Loading...
                            </small>
                        </p>
                    </div>
                    <div className={"card-footer text-right text-muted"}>
                        Loading...
                    </div>
                </div>
            </div>);
        }
    } else {
        return (
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 p-2">
                <div className="card">
                </div>
            </div>
        );
    }
}


