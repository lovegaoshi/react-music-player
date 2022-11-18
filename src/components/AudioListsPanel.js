import cls from 'classnames'
import React, { memo } from 'react'
import { PLAYER_KEY } from '../config/player'
import SORTABLE_CONFIG from '../config/sortable'
import { FixedSizeList as List } from 'react-window';

const rowRenderer = ({ 
  audioId,
  title,
  className,
  onClick,
  playerIcons,
  name,
  singer,
  clickToDeleteText,
  onDelete,
  remove,
  icon,
  style,
}) => {
  return (
    <li
      key={audioId}
      title={title}
      className={className}
      onClick={onClick}
      style={style}
    >
      <span className="group player-status">
        <span className="player-icons">
          {playerIcons}
        </span>
      </span>
      <span className="group player-name" title={name}>
        {name}
      </span>
      <span className="group player-singer" title={singer}>
        {singer}
      </span>
      {remove && (
        <span
          className="group player-delete"
          title={clickToDeleteText}
          onClick={onDelete(audioId)}
        >
          {icon.close}
        </span>
      )}
    </li>
  )
}

const AudioListsPanel = ({
  audioLists,
  onCancel,
  onDelete,
  onPlay,
  playId,
  loading,
  panelToggleAnimate,
  glassBg,
  remove,
  removeId,
  isMobile,
  locale,
  icon,
  playing,
  audioListRef,
  }) => {
    const Row = ({ index, style }) => {
      const audio = audioLists[index]
      const { name, singer } = audio
      const audioId = audio[PLAYER_KEY]
      const isCurrentPlaying = playId === audioId
      return rowRenderer({
        audioId,
        title: !playing
        ? locale.clickToPlayText
        : isCurrentPlaying
        ? locale.clickToPauseText
        : locale.clickToPlayText,
        className: cls(
          'audio-item',
          { playing: isCurrentPlaying },
          { pause: !playing },
          { remove: removeId === audioId },
        ),
        onClick: () => onPlay(audioId),
        playerIcons: isCurrentPlaying && loading
          ? icon.loading
          : isCurrentPlaying
          ? playing
            ? icon.pause
            : icon.play
          : undefined,
        name,
        singer,
        clickToDeleteText: locale.clickToDeleteText(name),
        onDelete,
        remove,
        icon,
        style,
      })
    }
    return (
    <div
      className={cls('audio-lists-panel', panelToggleAnimate, {
        'audio-lists-panel-mobile': isMobile,
        'glass-bg': glassBg,
      })}
    >
      <div className="audio-lists-panel-header">
        <h2 className="audio-lists-panel-header-title">
          <span>{locale.playListsText} / </span>
          <span className="audio-lists-panel-header-num">
            {audioLists.length}
          </span>
          <span className="audio-lists-panel-header-actions">
            {remove && (
              <>
                <span
                  className="audio-lists-panel-header-delete-btn"
                  title={locale.removeAudioListsText}
                  onClick={onDelete()}
                >
                  {icon.delete}
                </span>
                <span className="audio-lists-panel-header-line" />
              </>
            )}
            <span
              className="audio-lists-panel-header-close-btn"
              title={locale.closeText}
              onClick={onCancel}
            >
              {isMobile ? icon.packUpPanelMobile : icon.close}
            </span>
          </span>
        </h2>
      </div>
      <div
        className={cls('audio-lists-panel-content', {
          'no-content': audioLists.length < 1,
        })}
      >
        {audioLists.length >= 1 ? (
          <List
            ref={audioListRef}
            className="List"
            height={isMobile? window.innerHeight - 80 : 350}
            itemCount={audioLists.length}
            itemSize={50}
            width={isMobile? window.innerWidth : 480}
          >
            {Row}
          </List>
        ) : (
          <>
            <span>{icon.empty}</span>
            <span className="no-data">
              {locale.emptyText || locale.notContentText}
            </span>
          </>
        )}
      </div>
    </div>
  )}

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.audioLists === newProps.audioLists &&
    oldProps.loading === newProps.loading &&
    oldProps.playing === newProps.playing &&
    oldProps.visible === newProps.visible
  )
}

export default memo(AudioListsPanel, arePropsEqual)

/*
<ul className={SORTABLE_CONFIG.selector}>
            {audioLists.map((audio, index) => {
              return Row({index, style: {}})
            })}
          </ul>
*/