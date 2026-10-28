import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Panel from '../component/Admin/Panel'
import LocalisedField from '../component/Admin/LocalisedField'
import ImagePicker from '../component/Admin/ImagePicker'
import ConfirmDelete from '../component/Admin/ConfirmDelete'
import Select from '../component/ui/Select'
import Input from '../component/ui/Input'
import Button from '../component/ui/Button'
import EmptyState from '../component/ui/EmptyState'
import ContentImage from '../component/Content/ContentImage'
import { Icon } from '../component/ui/Icon'
import useAdminContent from '../hook/useAdminContent'
import useLanguage from '../hook/useLanguage'
import { mediaUrl } from '../config/api'
import { pickLanguageText } from '../util/localised'
import { cardDraft, emptyCard } from '../admin/drafts'

export default function AdminCards() {
  const { t, lang, tNumber } = useLanguage()
  const { schema, cards, saveCard, deleteCard, busy } = useAdminContent()
  const [params, setParams] = useSearchParams()
  const [form, setForm] = useState(null)

  const languages = schema.languages ?? ['en', 'bn']
  const slotPages = Object.entries(schema.pages).filter(([, definition]) => (definition.slots ?? []).length > 0)

  const page = slotPages.some(([name]) => name === params.get('page')) ? params.get('page') : slotPages[0]?.[0] ?? ''
  const slots = schema.pages[page]?.slots ?? []
  const slot = slots.includes(params.get('slot')) ? params.get('slot') : slots[0] ?? ''

  const list = cards
    .filter((card) => card.page === page && card.slot === slot)
    .sort((a, b) => a.sort - b.sort || a.id.localeCompare(b.id))

  const selectPage = (next) => {
    setForm(null)
    setParams({ page: next, slot: schema.pages[next]?.slots?.[0] ?? '' })
  }
  const selectSlot = (next) => {
    setForm(null)
    setParams({ page, slot: next })
  }

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const handleSave = async () => {
    const saved = await saveCard(form)
    if (saved) setForm(null)
  }

  if (slotPages.length === 0) {
    return <EmptyState icon="grid" title={t('admin.navCards')} description={t('admin.noSlots')} />
  }

  return (
    <div className="flex flex-col gap-5">
      <Panel title={t('admin.cardsTitle')} description={t('admin.cardsDescription')}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            id="card-page"
            label={t('admin.page')}
            value={page}
            options={slotPages.map(([name, definition]) => ({
              value: name,
              label: t(`nav.${name}`) === `nav.${name}` ? definition.label : t(`nav.${name}`),
            }))}
            onChange={(event) => selectPage(event.target.value)}
          />
          <Select
            id="card-slot"
            label={t('admin.section')}
            value={slot}
            options={slots.map((name) => ({ value: name, label: name }))}
            onChange={(event) => selectSlot(event.target.value)}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-base-content/60">
            {t('admin.cardCount', { n: tNumber(String(list.length)) })}
            {list.some((card) => !card.active) ? ` · ${t('admin.hidden')}` : ''}
          </p>
          <Button
            type="button"
            size="sm"
            className="gap-2"
            onClick={() => setForm(emptyCard(page, slot, languages))}
            disabled={Boolean(form)}
          >
            <Icon name="plus" className="h-4 w-4" />
            {t('admin.addCard')}
          </Button>
        </div>

        {list.length === 0 ? (
          <EmptyState icon="grid" title={t('admin.emptyCards')} description={t('admin.emptyCardsBody')} />
        ) : (
          <ul className="flex flex-col gap-3">
            {list.map((card) => (
              <li
                key={card.id}
                className="flex flex-wrap items-center gap-4 rounded-box border border-base-300 bg-base-200/50 p-3"
              >
                <div className="w-24 shrink-0">
                  <ContentImage
                    src={card.mediaId ? mediaUrl(card.mediaId) : ''}
                    label={card.icon ? undefined : t('admin.noImage')}
                    ratio="aspect-[4/3]"
                  />
                </div>
                <div className="flex min-w-40 flex-1 flex-col gap-1">
                  <span className="text-sm font-semibold text-base-content">
                    {pickLanguageText(card.title, lang) || t('admin.untitled')}
                    {!card.active && <span className="ms-2 badge badge-ghost badge-sm">{t('admin.hidden')}</span>}
                  </span>
                  <span className="text-xs text-base-content/60">{pickLanguageText(card.meta, lang)}</span>
                  <span className="text-xs text-base-content/45">
                    {t('admin.order')} {tNumber(String(card.sort))}
                    {card.icon ? ` · ${card.icon}` : ''}
                    {card.link ? ` · ${card.link}` : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    disabled={busy || Boolean(form)}
                    onClick={() => setForm(cardDraft(card, languages))}
                  >
                    <Icon name="edit" className="h-4 w-4" />
                    {t('admin.edit')}
                  </Button>
                  <ConfirmDelete
                    label={pickLanguageText(card.title, lang) || card.id}
                    busy={busy}
                    onConfirm={() => deleteCard(card.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {form && (
        <Panel
          title={form.id ? t('admin.editCard') : t('admin.addCard')}
          description={`${page} · ${slot}`}
          action={
            <Button type="button" size="sm" variant="ghost" onClick={() => setForm(null)}>
              {t('admin.close')}
            </Button>
          }
        >
          <LocalisedField
            name="card-title"
            label={t('admin.cardTitleLabel')}
            value={form.title}
            languages={languages}
            maxLength={schema.limits?.title}
            onChange={(value) => setField('title', value)}
          />
          <LocalisedField
            name="card-meta"
            label={t('admin.cardMetaLabel')}
            value={form.meta}
            languages={languages}
            maxLength={schema.limits?.meta}
            onChange={(value) => setField('meta', value)}
          />
          <LocalisedField
            name="card-description"
            label={t('admin.cardDescriptionLabel')}
            value={form.description}
            languages={languages}
            multiline
            rows={4}
            maxLength={schema.limits?.body}
            onChange={(value) => setField('description', value)}
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <Select
              id="card-icon"
              label={t('admin.icon')}
              value={form.icon}
              placeholder={t('admin.iconNone')}
              options={(schema.icons ?? []).map((name) => ({ value: name, label: name }))}
              onChange={(event) => setField('icon', event.target.value)}
            />
            <Input
              id="card-sort"
              type="number"
              label={t('admin.order')}
              value={String(form.sort)}
              min={0}
              onChange={(event) => {
                const next = Number.parseInt(event.target.value, 10)
                setField('sort', Number.isFinite(next) ? next : 0)
              }}
            />
            <Input
              id="card-link"
              label={t('admin.link')}
              value={form.link}
              placeholder="/about"
              hint={t('admin.linkHint')}
              maxLength={schema.limits?.link}
              onChange={(event) => setField('link', event.target.value)}
            />
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-base-content">
            <input
              type="checkbox"
              className="checkbox border-base-300 bg-base-100"
              checked={form.active}
              onChange={(event) => setField('active', event.target.checked)}
            />
            {t('admin.visible')}
          </label>

          <ImagePicker id="card-image" value={form.mediaId} onChange={(id) => setField('mediaId', id)} />

          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={handleSave} disabled={busy}>
              {busy ? t('admin.saving') : t('admin.save')}
            </Button>
            <Button type="button" variant="light" onClick={() => setForm(null)} disabled={busy}>
              {t('admin.cancel')}
            </Button>
          </div>
        </Panel>
      )}
    </div>
  )
}
