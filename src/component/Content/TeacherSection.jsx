import ContentSection from './ContentSection'
import SectionHeading from '../ui/SectionHeading'
import TeacherCard from './TeacherCard'
import useContent from '../../hook/useContent'

// Two profiles across a phone screen keeps each card the size of a photo, not the size of the screen.
const GRID = {
  1: 'grid gap-3 sm:gap-4',
  2: 'grid grid-cols-2 gap-3 sm:gap-4',
  3: 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4',
  4: 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4',
}

// The Teachers page had only card slots before. A saved teacher takes the section over; until an
// admin adds one, it renders exactly the cards — or the placeholder — it renders today.
export default function TeacherSection({ group, eyebrow, title, label, columns = 4 }) {
  const { teachersFor } = useContent()
  const teachers = teachersFor(group)

  if (teachers.length === 0) {
    return (
      <ContentSection
        page="teachers"
        slot={group}
        eyebrow={eyebrow}
        title={title}
        label={label}
        columns={columns}
        imageRatio="aspect-[4/3]"
      />
    )
  }

  return (
    <section className="border-t border-base-300 bg-base-100 py-14 sm:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6">
        <SectionHeading eyebrow={eyebrow} title={title} />

        <div className={GRID[columns] ?? GRID[3]}>
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} label={label} />
          ))}
        </div>
      </div>
    </section>
  )
}
