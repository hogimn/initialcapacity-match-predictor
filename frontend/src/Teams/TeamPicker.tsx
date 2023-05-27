import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../App/StateStore';
import {match} from 'ts-pattern';
import {ReactElement, useEffect, useMemo, useState} from 'react';
import {Team, TeamList} from './TeamsState';
import {Select} from '../Forms/Inputs';
import {forecastRequestState} from './ForecastRequestState';

/**
 * Represents type of team to be selected
 */
type Side = 'home' | 'away'

/**
 * Component for selecting a team for the home or away side.
 * @param {Object} props - The component props.
 * @param {TeamList} props.teamList - The list of available teams.
 * @param {Side} props.side - The side for which the team is being selected ('home' or 'away').
 * @returns {ReactElement} The rendered TeamSelector component.
 */
const TeamSelector = (props: { teamList: TeamList, side: Side }): ReactElement => {
    // Access the Redux dispatch function
    const dispatch = useDispatch();
    // Determine the opposite side (either 'home' or 'away')
    const otherSide = props.side === 'home' ? 'away' : 'home';
    // Get the selected team for the current side and the selected team for the opposite side from the Redux state
    const selectedTeam = useSelector((app: AppState) => app.forecastRequest[props.side]);
    const otherSelectedTeam = useSelector((app: AppState) => app.forecastRequest[otherSide]);

    // State for the selected league
    const [league, setLeague] = useState<string>('');

    // Filter the teams based on the selected league using memoization
    const teamsForCurrentLeague = useMemo<Team[]>(
        () => props.teamList.teams.filter(t => t.leagues.includes(league)),
        [league]
    );

    // Reset the selected league if the selected team is null
    useEffect(() => {
        if (!selectedTeam) {
            setLeague('');
        }
    }, [selectedTeam]);

    /**
     * Set the selected team for the current side.
     * @param {string} teamName - The name of the selected team.
     * @returns {void}
     */
    const setTeam = (teamName: string) => {
        // Find the team object based on the selected team name
        const team = teamsForCurrentLeague.filter(t => t.name === teamName).pop();

        if (team) {
            // Dispatch the appropriate action based on the current side
            match(props.side)
                .with('home', () => dispatch(forecastRequestState.setHome(team)))
                .with('away', () => dispatch(forecastRequestState.setAway(team)))
                .exhaustive();
        }
    };

    return <>
        <fieldset>
            <legend>{props.side}</legend>
            { /* Render a Select component for selecting the league */ }
            <Select
                id={props.side + '-league'}
                label={'league'}
                value={league}
                onChange={league => setLeague(league)}
                options={props.teamList.leagues}
            />
            { /* Render a Select component for selecting the team */ }
            <Select
                id={props.side + '-team'}
                label="name"
                value={selectedTeam?.name}
                required
                options={teamsForCurrentLeague.map(t => t.name)}
                onChange={teamName => setTeam(teamName)}
                isDisabled={teamName => teamName == otherSelectedTeam?.name}
            />
        </fieldset>
    </>;
};

/**
 * Component for rendering a team picker based on the side.
 * @param {Object} props - The component props.
 * @param {Side} props.side - The side for which the team picker is being rendered ('home' or 'away').
 * @returns {ReactElement} The rendered TeamPicker component.
 */
const TeamPicker = (props: { side: Side }): ReactElement => {
    // Get the teams data from the Redux state
    const teams = useSelector((app: AppState) => app.teams.data);

    // Render different components based on the state of the teams data
    return match(teams)
        // If teams data is not loaded, return an empty fragment
        .with({type: 'not loaded'}, () => <></>)
        // If teams data is loading, display "Loading"
        .with({type: 'loading'}, () => <>Loading</>)
        // If teams data is loaded, render the TeamSelector component with the teamList as the value and the specified side
        .with({type: 'loaded'}, ({value}) => <TeamSelector teamList={value} side={props.side}/>)
        // If teams data is refreshing, render the TeamSelector component with the teamList as the value and the specified side
        .with({type: 'refreshing'}, ({value}) => <TeamSelector teamList={value} side={props.side}/>)
        // If there is a failure in loading the teams data, display the error
        .with({type: 'failure'}, data => <>{data.error}</>)
        .exhaustive();
};

/**
 * Export the TeamPicker component as the default export
 */
export default TeamPicker;
