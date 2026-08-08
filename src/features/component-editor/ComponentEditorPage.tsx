import { useState } from 'react';
import { ROUTES } from '../../router';
import { Avatar, Badge } from '../../ui/atoms';
import { Button } from '../../ui/Button';
import { Checkbox } from '../../ui/Checkbox';
import { Field, LabeledRow } from '../../ui/Field';
import { Tabs } from '../../ui/Tabs';
import { cx } from '../../ui/cx';
import {
  AdSlotIcon,
  ComponentMarkIcon,
  PlayIcon,
  PlusIcon,
  ShortsPlayerIcon,
  SideRailIcon,
  TimerIcon,
  UploadIcon,
} from '../../ui/icons';
import { HatchStream } from '../../components/ad/HatchStream';
import { ShortsRail } from '../../components/ad/ShortsRail';
import { TimerChip } from '../../components/ad/TimerChip';
import { EditorCanvas } from '../editor/EditorCanvas';
import {
  EditorShell,
  EditorTopBar,
  HomeLogo,
  PanelHeading,
} from '../editor/EditorShell';
import { LayerRow } from '../editor/LayerRow';
import { useRenames } from '../editor/useRenames';
import { EXPOSED_PROPS, LAYERS, PANEL_TABS, type LayerId, type PanelTab } from './componentData';
import s from './componentEditor.module.css';

const PHONE_WIDTH = 390;

/**
 * Where UX engineers build reusable elements. The payoff is "Expose as prop":
 * options ticked here become the smart options researchers see in the
 * prototype editor.
 */
export function ComponentEditorPage() {
  const [selected, setSelected] = useState<LayerId>('timer');
  const [panelTab, setPanelTab] = useState<PanelTab>('properties');
  const [exposed, setExposed] = useState({ unskippable: true, skipAfter: true });
  const [editableProps, setEditableProps] = useState(() => EXPOSED_PROPS.map((prop) => ({ ...prop })));
  const [componentName, setComponentName] = useState('YouTube Shorts page');
  const { nameOf, rename } = useRenames();

  const toggleExposed = (key: keyof typeof exposed) =>
    setExposed((current) => ({ ...current, [key]: !current[key] }));

  /** Picking a layer always drops you back on its Properties tab. */
  const selectLayer = (id: LayerId) => {
    setSelected(id);
    setPanelTab('properties');
  };

  const selectedLayer = LAYERS.find((layer) => layer.id === selected)!;
  const layerIcons = {
    player: ShortsPlayerIcon,
    rail: SideRailIcon,
    adslot: AdSlotIcon,
    timer: TimerIcon,
  } satisfies Record<LayerId, typeof ShortsPlayerIcon>;

  return (
    <EditorShell
      accent="green"
      topBar={
        <EditorTopBar
          left={
            <HomeLogo>
              <ComponentMarkIcon size={16} />
            </HomeLogo>
          }
          center={
            <>
              <input
                className={s.componentNameInput}
                aria-label="Component filename"
                value={componentName}
                spellCheck={false}
                onChange={(event) => setComponentName(event.target.value)}
              />
              <Badge>Component</Badge>
            </>
          }
          right={
            <>
              <Button variant="outline" size="bar">
                Preview
              </Button>
              {/* Publishing ends the job, so it hands you back to the library
                  the component just landed in. */}
              <Button
                size="bar"
                onClick={() => {
                  window.location.hash = ROUTES.marketplace;
                }}
              >
                <UploadIcon size={15} />
                Publish to library
              </Button>
              <Avatar initials="S" color="#2f9e44" />
            </>
          }
        />
      }
      left={
        <>
          <div className={s.layersSection}>
            <PanelHeading title="Layers" action={{ label: 'Add element', icon: <PlusIcon /> }} />
            <div className={s.layerList}>
              {LAYERS.map((layer) => {
                const LayerIcon = layerIcons[layer.id];
                return <LayerRow
                  key={layer.id}
                  label={nameOf(layer.id, layer.name)}
                  selected={selected === layer.id}
                  onClick={() => selectLayer(layer.id)}
                  onRename={(name) => rename(layer.id, name)}
                  icon={<LayerIcon className={cx(s.layerIcon, selected === layer.id && s.layerIconOn)} />}
                  trailing={layer.exposed && <Badge small>prop</Badge>}
                />;
              })}
            </div>
          </div>

          <div className={s.propsSection}>
            <PanelHeading title="Editable props" />
            <p className={s.explainer}>
              Props available when this component is used in a prototype.
            </p>
            <div className={s.propList}>
              {editableProps.map((prop, index) => (
                <div key={index} className={s.propRow}>
                  <select
                    className={s.propTypeInput}
                    aria-label={`Type for ${prop.name}`}
                    value={prop.type}
                    onChange={(event) =>
                      setEditableProps((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, type: event.target.value } : item,
                        ),
                      )
                    }
                  >
                    <option value="bool">bool</option>
                    <option value="int">int</option>
                    <option value="src">src</option>
                    <option value="text">text</option>
                  </select>
                  <input
                    className={s.propNameInput}
                    aria-label={`Name for prop ${index + 1}`}
                    value={prop.name}
                    spellCheck={false}
                    onChange={(event) =>
                      setEditableProps((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, name: event.target.value } : item,
                        ),
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      }
      canvas={
        <EditorCanvas label="Component preview" frameWidth={PHONE_WIDTH}>
          <div className={s.phone}>
            <HatchStream step={14} tone="shorts">
              <PlayIcon size={40} style={{ color: 'rgba(255,255,255,.4)' }} />
            </HatchStream>
            <ShortsRail size={24} />
            <div className={s.adSlot}>Ad slot</div>
            <TimerChip label="0:05" style={{ position: 'absolute', right: 14, bottom: 96 }} />
          </div>
        </EditorCanvas>
      }
      right={
        <>
          <div className={s.panelHead}>
            <PanelHeading title={nameOf(selectedLayer.id, selectedLayer.name)} />
            <Tabs options={PANEL_TABS} value={panelTab} onChange={setPanelTab} />
          </div>
          <div className={s.panelBody}>
            {panelTab === 'properties' && (
              <div className={s.group}>
                <div>
                  <span className={s.groupTitle}>Timer</span>
                  <div className={s.rows}>
                    <div className={s.spread}>
                      <span>Position</span>
                      <Field size="sm">Bottom right</Field>
                    </div>
                    <div className={s.spread}>
                      <span>Default skip after</span>
                      <Field size="sm" mono>
                        5s
                      </Field>
                    </div>
                  </div>
                </div>

                <div className={s.divider}>
                  <span className={s.groupTitle}>Expose as prop</span>
                  <p className={s.explainer}>
                    Turn this on so researchers can edit it from the element&apos;s options.
                  </p>
                  <div className={s.rows}>
                    <Checkbox
                      label="Unskippable toggle"
                      checked={exposed.unskippable}
                      onChange={() => toggleExposed('unskippable')}
                    />
                    <Checkbox
                      label="Skip-after seconds"
                      checked={exposed.skipAfter}
                      onChange={() => toggleExposed('skipAfter')}
                    />
                  </div>
                </div>
              </div>
            )}

            {panelTab === 'behavior' && (
              <div className={s.note}>
                Define what the timer does when it reaches zero — reveal the skip button, log a
                completion event, or advance the stream.
              </div>
            )}

            {panelTab === 'style' && (
              <div className={s.styleRows}>
                <LabeledRow label="Fill" labelWidth={70}>
                  <span className={s.swatch} style={{ background: 'rgba(0,0,0,.62)' }} />
                  <span className={s.monoValue}>#000 62%</span>
                </LabeledRow>
                <LabeledRow label="Radius" labelWidth={70}>
                  <Field grow>999 px</Field>
                </LabeledRow>
              </div>
            )}
          </div>
        </>
      }
    />
  );
}
