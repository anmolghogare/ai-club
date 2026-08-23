import asyncio
import logging
from datetime import datetime, timedelta, timezone

from db import async_session, engine, Base
from auth.models import User
from weekly_veneza.models import WeeklyVenezaWeek, WeeklyVenezaResource

logging.basicConfig(level=logging.INFO)

async def seed_data():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        # Check existing
        result = await db.execute(
            WeeklyVenezaWeek.__table__.select()
        )
        if result.first():
            logging.info("Weekly Veneza data already exists. Skipping seed.")
            return

        logging.info("Seeding Weekly Veneza sample data...")

        # Current time reference
        now = datetime.now(timezone.utc)
        target_week3 = (now + timedelta(days=5)).isoformat()

        # Week 1
        w1 = WeeklyVenezaWeek(
            week_number=1,
            title="Start Here: Foundations of Neural Networks",
            description="Four core foundational resources to build backpropagation visual & mathematical intuition.",
            target_date=(now - timedelta(days=14)).isoformat(),
            is_current=False,
            status="past",
            order_no=1,
        )
        db.add(w1)
        await db.flush()

        r1_1 = WeeklyVenezaResource(
            week_id=w1.id,
            title="3Blue1Brown — Neural Networks",
            description="Four videos that make backpropagation visual before it becomes algebraic.",
            resource_type="VIDEO",
            url="https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi",
            est_minutes=45,
            order_no=1,
        )
        r1_2 = WeeklyVenezaResource(
            week_id=w1.id,
            title="Neural Networks: Zero to Hero",
            description="Karpathy builds autograd, then a language model, from an empty file. Our language track follows this.",
            resource_type="COURSE",
            url="https://karpathy.ai/zero-to-hero.html",
            est_minutes=480,
            order_no=2,
        )
        r1_3 = WeeklyVenezaResource(
            week_id=w1.id,
            title="Practical Deep Learning — fast.ai",
            description="Top-down: you train a working model in lesson one and learn why it worked in lesson six.",
            resource_type="COURSE",
            url="https://course.fast.ai/",
            est_minutes=360,
            order_no=3,
        )
        r1_4 = WeeklyVenezaResource(
            week_id=w1.id,
            title="Deep Learning — Goodfellow, Bengio, Courville",
            description="The definitive textbook covering linear algebra, probability, numerical computation, and deep networks.",
            resource_type="BOOK",
            url="https://www.deeplearningbook.org/",
            est_minutes=600,
            order_no=4,
        )
        db.add_all([r1_1, r1_2, r1_3, r1_4])

        # Week 2
        w2 = WeeklyVenezaWeek(
            week_number=2,
            title="Computer Vision & Deep Residual Networks",
            description="Explore spatial feature extractions, convolutions, residual connections, and transfer learning.",
            target_date=(now - timedelta(days=7)).isoformat(),
            is_current=False,
            status="past",
            order_no=2,
        )
        db.add(w2)
        await db.flush()

        r2_1 = WeeklyVenezaResource(
            week_id=w2.id,
            title="CS231n: Deep Learning for Computer Vision",
            description="Stanford's flagship course detailing CNN architectures, object detection, and segmentation.",
            resource_type="COURSE",
            url="https://cs231n.stanford.edu/",
            est_minutes=360,
            order_no=1,
        )
        r2_2 = WeeklyVenezaResource(
            week_id=w2.id,
            title="Deep Residual Learning for Image Recognition (ResNet)",
            description="The landmark paper introducing skip connections to train ultra-deep neural networks.",
            resource_type="PAPER",
            url="https://arxiv.org/abs/1512.03385",
            est_minutes=90,
            order_no=2,
        )
        db.add_all([r2_1, r2_2])

        # Week 3 (CURRENT ACTIVE WEEK)
        w3 = WeeklyVenezaWeek(
            week_number=3,
            title="Week 3: Python, Data Science & ML Fundamentals",
            description="Essential Python basics, NumPy array computing, Pandas data analysis, and Stanford's Machine Learning Specialization.",
            target_date=target_week3,
            is_current=True,
            status="current",
            order_no=3,
        )
        db.add(w3)
        await db.flush()

        r3_1 = WeeklyVenezaResource(
            week_id=w3.id,
            title="Python Basics",
            description="Complete Python tutorial covering data structures, control flow, functions, and core programming principles.",
            resource_type="VIDEO",
            url="https://youtu.be/rfscVS0vtbw?si=btlOx35YT9Pdne0X",
            est_minutes=120,
            order_no=1,
        )
        r3_2 = WeeklyVenezaResource(
            week_id=w3.id,
            title="NumPy",
            description="High-performance numerical computing in Python, multidimensional array manipulation, and vectorization.",
            resource_type="VIDEO",
            url="https://youtu.be/QUT1VHiLmmI?si=1wLSgS89McMWE-T2",
            est_minutes=90,
            order_no=2,
        )
        r3_3 = WeeklyVenezaResource(
            week_id=w3.id,
            title="Pandas",
            description="Comprehensive data analysis & manipulation library covering DataFrames, series, filtering, and data cleaning.",
            resource_type="COURSE",
            url="https://youtube.com/playlist?list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS&si=oPOnrY3KmCaUa9uL",
            est_minutes=180,
            order_no=3,
        )
        r3_4 = WeeklyVenezaResource(
            week_id=w3.id,
            title="Machine Learning Specialization - 1 (Andrew Ng)",
            description="Supervised Machine Learning: Regression and Classification by Stanford / DeepLearning.AI instructor Andrew Ng.",
            resource_type="COURSE",
            url="https://youtube.com/playlist?list=PLkDaE6sCZn6FNC6YRfRQc_FbeQrF8BwGI&si=CQKlhHfzpvsKGd0V",
            est_minutes=360,
            order_no=4,
        )
        db.add_all([r3_1, r3_2, r3_3, r3_4])

        # Week 4 (Upcoming)
        w4 = WeeklyVenezaWeek(
            week_number=4,
            title="Generative Diffusion & Autonomous AI Agents",
            description="Learn score-based generative modeling, Latent Diffusion, and autonomous multi-agent systems.",
            target_date=(now + timedelta(days=12)).isoformat(),
            is_current=False,
            status="upcoming",
            order_no=4,
        )
        db.add(w4)
        await db.flush()

        r4_1 = WeeklyVenezaResource(
            week_id=w4.id,
            title="High-Resolution Image Synthesis with Latent Diffusion Models",
            description="The Stable Diffusion paper explaining noise schedules and latent space sampling.",
            resource_type="PAPER",
            url="https://arxiv.org/abs/2112.10752",
            est_minutes=90,
            order_no=1,
        )
        r4_2 = WeeklyVenezaResource(
            week_id=w4.id,
            title="Building Autonomous AI Agents",
            description="Architecting tool-using LLM agents, memory systems, and reasoning loops.",
            resource_type="COURSE",
            url="https://www.deeplearning.ai/short-courses/",
            est_minutes=120,
            order_no=2,
        )
        db.add_all([r4_1, r4_2])

        await db.commit()
        logging.info("Weekly Veneza seed data inserted successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
