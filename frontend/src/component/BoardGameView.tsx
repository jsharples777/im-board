import React from "react";
import PropTypes from 'prop-types';
import moment from 'moment';
import debug from 'debug';

import controller from "../Controller";
import {Decorator} from "../AppTypes";

const beLogger = debug('view-ts:boardgameview');


// @ts-ignore
export default function BoardGameView({boardGame, showScoresHandler, deleteEntryHandler}) {
    if (boardGame) {
        beLogger(`Board Game ${boardGame.id}`);

        let deleteButton =
                <button type="button"
                        className="btn-warning btn-sm rounded p-1 mr-2"
                        entry-id={boardGame.id} onClick={deleteEntryHandler}>
                    &nbsp;&nbsp;Delete &nbsp;
                    <i className="fas fa-trash-alt"></i>&nbsp;&nbsp;
                </button>

        if ((boardGame.decorator) && (boardGame.decorator === Decorator.Complete)) {

            return (
                <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 p-2">
                    <div className="card">
                        <img className="card-img-top" src={boardGame.image} alt="Card image cap"></img>
                        <div className="card-body">
                            <h5 className="card-title">{boardGame.name} ({boardGame.year})</h5>
                            <p className="card-text">{boardGame.description}</p>
                            <p className="card-text">
                                <small className="text-muted">
                                    Play Time: ${boardGame.minPlayTime} - ${boardGame.maxPlayTime} min<br/>
                                    Players: ${boardGame.minPlayers} - ${boardGame.maxPlayers} Min Age:
                                    ${boardGame.minAge}<br/>
                                    Categories: ${boardGame.categories}
                                </small>
                            </p>
                            {deleteButton}
                        </div>
                        <div className={"card-footer text-right text-muted"}>
                            Rank: {boardGame.rank} Score: {boardGame.averageScore} from {boardGame.numOfRaters} raters
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
                        <h5 className="card-title">{boardGame.name} ({boardGame.year})</h5>
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


