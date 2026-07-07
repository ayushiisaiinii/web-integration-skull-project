from db import SessionLocal, Job

def set_status(job_id: str, status: str, **extra):
    db = SessionLocal()
    job = db.query(Job).filter(Job.job_id == job_id).first()
    if not job:
        job = Job(job_id=job_id, status=status)
        db.add(job)
    else:
        job.status = status
    for k, v in extra.items():
        setattr(job, k, v)
    db.commit()
    db.close()

def get_status(job_id: str) -> dict:
    db = SessionLocal()
    job = db.query(Job).filter(Job.job_id == job_id).first()
    db.close()
    if not job:
        return None
    return {c.name: getattr(job, c.name) for c in job.__table__.columns}